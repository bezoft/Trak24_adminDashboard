import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import RTemplate from '../Components/ReportTemplate';
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import { processReportData } from '../DataHelpers/ReportPro';

function ReportViewer() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [isFetching, setIsFetching] = useState(false); // Track fetching state
    const [isProcessing, setIsProcessing] = useState(false); // Track processing state
    const imei = searchParams.get("_id"); // Extract `_id`
    const date = searchParams.get("d");

    useEffect(() => {
        GetReports();
    }, []);

    const GetReports = async () => {
        try {
            setIsFetching(true); // Start fetching
            const url = `http://148.113.44.181:8001/reports/by-date?startDate=${date}&endDate=${date}&imei=${imei}`;
            const response = await axios.get(url);

            setIsFetching(false); // Fetching complete
            setIsProcessing(true); // Start processing

            const d = await processReportData(response.data.receivedData[0].reports);

            setData(d);
            setIsProcessing(false); // Processing complete
        } catch (error) {
            console.error(error);
            setIsFetching(false);
            setIsProcessing(false);
        }
    };

    return (
        <>
            {isFetching ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center">
                        <img src="/images/fetching.gif" alt="Fetching data" />
                        <h1>Fetching Reports...</h1>
                    </div>
                </div>
            ) : isProcessing ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center">
                        <img src="/images/processing.gif" alt="Processing data" />
                        <h1>Processing Reports...</h1>
                    </div>
                </div>
            ) : data.length > 0 ? (
                <PDFViewer className="w-full h-[100vh]">
                    <RTemplate reports={data} />
                </PDFViewer>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center">
                        <h1>No Reports Available</h1>
                    </div>
                </div>
            )}
        </>
    );
}

export default ReportViewer;
