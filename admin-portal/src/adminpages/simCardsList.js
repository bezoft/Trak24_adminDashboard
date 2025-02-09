import React, { useEffect, useState } from 'react'
import Header from '../Components/header'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { processReportData } from '../DataHelpers/ReportPro';
import Modal from '../Components/Modal';
import ToggleButton from '../Components/ToggleButton';
import {DateTimeFormatter} from '../Components/Date&TimeCell';

function SimCardsList() {

  const [Data, setData] = useState([]);
  const [AllBatches, setAllBatches] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [formData, setFormData] = useState({
    batch: "",
    sim1Number: "",
    eSim2Provider: "",
    simId: "",
  });
  const [open, setOpen] = useState(false)


  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const GetAllSimBatches = async () => {

    try {
      const response = await axios.get('/api-trkadn/get-all-simbatches');
      console.log("makes", response.data.data);

      if (response.statusText === "OK") {
        setAllBatches(response.data.data)
      }
    } catch (error) {
      alert('Error creating user: ' + error.response.data.message);
    }
  };

  useEffect(() => {
    GetAllSimBatches()
  }, [])

  const FindSimByBatch = async (batch) => {

    try {
      console.log("Loading");
      //setIsLoading(true);
      const res = await axios.get(`/api-trkadn/getsim-by-batch/${batch}`);
      if (res.status === 200) {
        console.log(res);
        
        console.log(res.data.data);
        setData(res.data.data)

      } else {
        console.log("Empty data received");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // Ensure loading and refreshing states are reset
      //   setIsLoading(false);
      //   setIsRefreshing(false);
    }
  };

  const FindSimByNumber = async (number) => {

    try {
      console.log("Loading");
      //setIsLoading(true);
      const res = await axios.get(`/api-trkadn/getsim-by-number/${number}`);
      if (res.status === 200) {
        console.log(res.data.data);
        setData([...res.data.data]);

      } else {
        console.log("Empty data received");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // Ensure loading and refreshing states are reset
      //   setIsLoading(false);
      //   setIsRefreshing(false);
    }
  };

  const FindSimById = async (id) => {

    try {
      console.log("Loading");
      //setIsLoading(true);
      const res = await axios.get(`/api-trkadn/getsim-by-id/${id}`);
      if (res.status === 200) {
        console.log(res);
        setData([...res.data.data]);

      } else {
        console.log("Empty data received");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // Ensure loading and refreshing states are reset
      //   setIsLoading(false);
      //   setIsRefreshing(false);
    }
  };

  const FindByESim2Provider = async (provider) => {

    try {
      console.log("Loading");
      //setIsLoading(true);
      const res = await axios.get(`/api-trkadn/getsim-by-provider/${provider}`);
      if (res.status === 200) {
        console.log(res.data.data);
        setData(res.data.data)

      } else {
        console.log("Empty data received");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // Ensure loading and refreshing states are reset
      //   setIsLoading(false);
      //   setIsRefreshing(false);
    }
  };

  return (
    <>
      <Header />
      <div className=' mt-24 flex flex-row justify-between items-center h-full'>
        <div>
          <h1 className='text-gray-900 dark:text-gray-300 font-semibold text-3xl p-6'>
            SIM Crads List
          </h1>
        </div>

      </div>

      <div className='flex w-full space-x-5 px-5 items-end'>
        <div>
          <label
            className="block text-sm text-gray-700 dark:text-white mb-1"
            htmlFor="batch"
          >
            Filter By Batch
          </label>
          <select
            id="batch"
            name="batch"
            value={formData.batch}
            onChange={(e) => {
              const batch = e.target.value;
              setFormData({ ...formData, batch: batch });
              FindSimByBatch(batch);
            }}
            className="w-full px-4 py-2 border bg-white dark:bg-[#23272f] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required
          >
            <option value="">Select a Make</option>
            {Array.isArray(AllBatches) && AllBatches.length > 0 ? (
              AllBatches.map((batch, index) => (
                <option value={`${batch.batchName}, ${batch.gsmProvider}-${batch.purchaseDate}`}>{batch.batchName}, {batch.gsmProvider}-{batch.purchaseDate}</option>
              ))
            ) : (
              <option value="" disabled>No Make Found, Create One!</option>
            )}

          </select>

        </div>

        <div>
          <label
            className="block text-sm text-gray-700 dark:text-white mb-1"
            htmlFor="eSim2Provider"
          >
            Filter By Provider
          </label>
          <select
            id="eSim2Provider"
            name="eSim2Provider"
            value={formData.eSim2Provider}
            onChange={(e) => {
              const provider = e.target.value;
              setFormData({ ...formData, eSim2Provider: provider });
              FindByESim2Provider(provider);
            }}
            className="w-full px-4 py-2 border bg-white dark:bg-[#23272f] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required
          >
            <option value="">Select Network Provider</option>
            <option value="Airtel">Airtel</option>
            <option value="Vi eSIM">Vi eSIM</option>
            <option value="BSNL">BSNL</option>
            <option value="Vodafone">Vodafone</option>
            <option value="Du">Du</option>
            <option value="Nawras">Nawras</option>
            <option value="Etisalat">Etisalat</option>
            <option value="M2M">M2M</option>
            <option value="Airtel eSIM">Airtel eSIM</option>

          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-white mb-1">Find By SIM Number</label>
          <input
            type="text"
            name="serialNo"
            value={formData.sim1Number}
            onChange={(e) => {
              const num = e.target.value;
              setFormData({ sim1Number: num, simId: "" }); // Update both fields in one call
            }}
            className="w-full px-4 py-2 border bg-white dark:bg-[#23272f] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter SIM Number"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-white mb-1">Find By IMSI/ICCID Number</label>
          <input
            type="text"
            name="serialNo"
            value={formData.simId}
            onChange={(e) => {
              const id = e.target.value;
              setFormData({ sim1Number: "", simId: id }); // Update both fields in one call
            }}
            className="w-full px-4 py-2 border bg-white dark:bg-[#23272f] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter IMSI/ICCID Number"
          />
        </div>

        <button
          className="bg-orange-600 text-white h-10 px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
          onClick={() => {
            if (formData.sim1Number && !formData.simId) {
              FindSimByNumber(formData.sim1Number);
            } else if (!formData.sim1Number && formData.simId) {
              FindSimById(formData.simId);
            }
          }}
        >
          Find
        </button>
      </div>

      <div className={`   min-h-screen`}> {/* Theme-based background and text color */}
        <div className="overflow-x-auto p-4 ">
          <table className="min-w-full border border-gray-300  dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-[#343a46]">
                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">Sl No</th>
                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">SIM/eSIM1</th>
                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">eSIM2</th>
                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">eSIM Service Provider</th>
                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">IMSI/ICCID	</th>
                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 ">Batch</th>
                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Activation</th>
                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Expiry</th>
                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Created By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {Array.isArray(Data) && Data.length > 0 && Data.map((item, index) => (
                <React.Fragment key={index}>
                  {/* Main Row */}
                  <tr
                    className="hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => toggleRow(index)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.eSim2Number},<br />{item.eSim2Provider}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center"></td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.simId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.batch}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center"><DateTimeFormatter isoDateTime={item.actDate} /></td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center"><DateTimeFormatter isoDateTime={item.expyDate} /></td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Upload Invoice</td>

                  </tr>
                  {/* Collapsible Row */}
                  {expandedRow === index && (
                    <tr>
                      <td colSpan="10" className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300">
                        <div className="flex justify-between items-start">
                          {/* Information Section */}
                          <div className='space-y-7'>

                            <div className="flex space-x-16">
                              <div className="flex flex-col space-y-1 justify-center">
                                <span className="text-sm ">Created on</span>
                                <span className="text-md font-semibold">add date needed</span>
                              </div>
                              <div className="flex flex-col space-y-1 ">
                                <span className="text-sm ">Unit Info</span>
                                <span className="text-md font-semibold ">{item.unitid?.imei}<br/>{item.unitid?.shipment} - {item.unitid?.model}</span>
                              </div>
                              <div className="flex flex-col space-y-1 ">
                                <span className="text-sm ">Customer & Vehicle Info</span>
                                <span className="text-md font-semibold">{item.unitid?.customer.firstname}, {item.unitid?.customer.company}<br/>{item.unitid?.assetRegNo} - {item.unitid?.assetMake}, {item.unitid?.assetModel}</span>
                              </div>
                              <div className="flex flex-col space-y-1 ">
                                <span className="text-sm ">Comments</span>
                                <span className="text-md font-semibold">Attached & Active Last Signal<br/> on 12-Sep-2024 07:21 PM </span>
                              </div>
                              <div className="flex flex-col space-y-1 ">
                                <span className="text-sm ">Delete SIM</span>
                                {/* <span className="text-md font-semibold underline hover:cursor-pointer" onClick={() => navigate(`/update-customer/${item._id}`)}>Delete</span> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  )
}

export default SimCardsList