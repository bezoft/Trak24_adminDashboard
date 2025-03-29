import React, { useEffect, useState } from 'react'
import Modal from '../../Components/Modal';
import axios from 'axios';

function AllContacts({ Aopen, AonClose, id,contacts }) {
    const [Data, setData] = useState([]);
    useEffect(() => {
        if(contacts){
            setData(contacts)
        }else{
            GetallAdmins()
        }
       
    }, [])
    console.log(contacts);
    
    const GetallAdmins = async () => {
        try {
            console.log("Loading");
            //setIsLoading(true);
            const res = await axios.get(`/api-trkadn/getcontacts-by-id/${id}`);
            if (res.status === 200) {
                console.log(res.data.contacts);
                
                setData(res.data.contacts);
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

console.log(Data);


    return (
        <Modal open={Aopen} onClose={AonClose} size={"xl overflow-y-auto"}>

            <div className="text-gray-900 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center">Contacts</h2>
                <div className="flex justify-center overflow-x-auto p-4 mt-5 max-h-[400px] overflow-y-auto">
                    <table className="min-w-fit border border-gray-300 dark:bg-[#1b1b1d] dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#343a46]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 ">No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Name</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Mobile No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Email</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 ">Response</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 ">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {Array.isArray(Data) && Data.length > 0 &&
  Data.map((item, index) => (
                             <tr>
                             <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index+1}</td>
                             <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.name}</td>
                             <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.phNumber}</td>
                             <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.email}</td>

                             <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.comType}</td>
                             <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.active===true?"Acitve":"Inactive"}</td>
                             
                         </tr>
                        ))}
                           
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    )
}

export default AllContacts