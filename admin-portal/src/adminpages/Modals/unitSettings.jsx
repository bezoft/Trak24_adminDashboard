import React, { useEffect, useState } from 'react'
import Modal from '../../Components/Modal';
import axios from 'axios';
import axiosInstance from '../../auth/interceptor';
import ToggleButton from '../../Components/ToggleButton';

function UnitSettings({ open, onClose, unit,GetUserUnits }) {
    const [settings, setPermissions] = useState({
        odometer: true,
    });
    console.log(unit);

    useEffect(() => {
        if (unit && unit.settings) {
            setPermissions(unit.settings);
        }
    }, [unit]);


const UpdateSettings = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post(`/api-trkadn/update-unitsettings/${unit._id}`, settings);


            if (response.status === 200) {
                onClose();
                GetUserUnits(unit.customer._id)
            }
        } catch (error) {
            alert('Error Editing settings: ' + error.response.data.message);
        }
    };

    const handleToggle = (key) => {
        setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="text-gray-900 dark:text-gray-200 space-y-4">
                <h2 className="text-xl font-bold mb-6 text-center">Unit Settings</h2>
                <div className='flex space-x-10 items-center'>

                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">IMEI</span>
                        <p className="font-medium text-lg">{unit.imei || "Not Available"}</p>
                    </div>

                     <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Unit Model</span>
                        <p className="font-medium text-lg">{unit.model || "Not Available"}</p>
                    </div>

                </div>

                <div className="space-y-10">
                    {/* Web Login Toggle */}
                    <div className="flex items-center justify-between">
                        <label className="text-lg">Show Odometer Reading</label>
                        <ToggleButton
                            isToggled={settings.odometer}
                            onToggle={() => handleToggle("odometer")}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-10 flex justify-end space-x-10 ">
                <button
                    onClick={onClose}
                    className="px-6 py-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-300 dark:bg-gray-700 rounded-md"
                >
                    Cancel
                </button>
                <button
                    onClick={UpdateSettings}
                    className="px-6 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-md"
                >
                    Save
                </button>
            </div>

        </Modal>
    )
}

export default UnitSettings