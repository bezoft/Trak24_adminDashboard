import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Components/header";
import { useParams } from "react-router-dom";

const SimEntry = () => {
  // State to manage form data
  const [AllBatches, setAllBatches] = useState([]);
  const [formData, setFormData] = useState({
    batch: "",
    sim1Number: "",
    eSim2Number: "",
    eSim2Provider: "",
    actDate: "",
    expyDate: "",
    eSimServProvider: "",
    simId: "",
    simType: "",
    serialNo: "",
    puc1: "",
    puc2: "",
  });

  const GetAllSimBatches = async () => {

    try {
      const response = await axios.get('/api-trkadn/get-all-simbatches');
      console.log("makes", response.data.data);

      if (response.status === 200) {
        setAllBatches(response.data.data)
      }
    } catch (error) {
      alert('Error creating user: ' + error.response.data.message);
    }
  };

  useEffect(() => {
    GetAllSimBatches()
  }, [])



  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
console.log(formData);

    try {
      const response = await axios.post('/api-trkadn/create-sim-card', formData);
      console.log(response);

      if (response.status === 201) {
        window.location.href = '/sim-cards';
      }
    } catch (error) {
      alert('Error creating user: ' + error.response.data.message);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen mt-20 flex items-center justify-center">
        <div className="p-8 max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-6 text-center">
            New Sim Card Entry
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" >
            {/* First Name */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                htmlFor="batch"
              >
                Batch
              </label>
              <select
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required
              >
                <option value="">Select a Make</option>
                {Array.isArray(AllBatches) && AllBatches.length > 0 ? (
                  AllBatches.map((batch, index) => (
                    <option value={batch._id}>{batch.batchName}, {batch.gsmProvider}-{batch.purchaseDate}</option>
                  ))
                ) : (
                  <option value="" disabled>No Make Found, Create One!</option>
                )}

              </select>
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">SIM/eSIM1 Number</label>
              <input
                type="text"
                name="sim1Number"
                value={formData.sim1Number}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter SIM/eSIM1 Number"
              />
            </div>
            {/* Mobile */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                htmlFor="eSimServProvider"
              >
                eSIM Service Provider
              </label>
              <select
                id="eSimServProvider"
                name="eSimServProvider"
                value={formData.eSimServProvider}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required
              >
                <option value="">Select Service Provider</option>
                <option value="Vodafone Idea Ltd">Vodafone Idea Ltd</option>
                <option value="Taisys">Taisys</option>
                <option value="Sensorise">Sensorise</option>

              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">eSIM 2 Number</label>
              <input
                type="text"
                name="eSim2Number"
                value={formData.eSim2Number}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter eSIM 2 Number"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                htmlFor="eSim2Provider"
              >
                eSIM 2 Provider
              </label>
              <select
                id="eSim2Provider"
                name="eSim2Provider"
                value={formData.eSim2Provider}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required
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
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Activation Date</label>
              <input
                type="datetime-local"
                name="actDate"
                value={formData.actDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter Company Name"
              />
            </div>
            {/* Cu
            {/* Address - Building No, Street */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Expiry Date</label>
              <input
                type="datetime-local"
                name="expyDate"
                value={formData.expyDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter Building No, Street"
              />
            </div>
            {/* Address - District */}
           
            {/* Address - State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">IMSI/ICCID Number</label>
              <input
                type="text"
                name="simId"
                value={formData.simId}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter IMSI/ICCID Number"
              />
            </div>
            {/* Address - PIN Code */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                htmlFor="simType"
              >
                SIM card Type
              </label>
              <select
                id="simType"
                name="simType"
                value={formData.simType}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required
              >
                <option value="">Select SIM card Type</option>
                <option value="Data">Data</option>
	<option value="Voice+Data">Voice+Data</option>
	<option value="eSIM">eSIM</option>

              </select>
            </div>
            {/* Address - Landline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Serial No</label>
              <input
                type="text"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter Serial No"
              />
            </div>
            {/* Sales Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">PUC 1 Number</label>
              <input
                type="text"
                name="puc1"
                value={formData.puc1}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter PUC 1 Number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">PUC 2 Number</label>
              <input
                type="text"
                name="puc2"
                value={formData.puc2}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter PUC 2 Number"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
              >Save SIM 
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SimEntry;
