"use client";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { useCustomModal } from "../shared/customModal";



export default function AddAPI() {
    const [apiKey, setApiKey] = useLocalStorage<string>("apiKey", "");

    const handleSaveApiKey = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement; // Type assertion here
        const formData = new FormData(form);
        const key = formData.get("apiKey") as string;
        if (key) {
            try {
                setApiKey(key);
            } catch (e) {
                console.log(e)
            } finally {
                    window.location.reload();
            }

        } else {
            alert("Please provide API key")
        }

    };
    const { setShowCustomModal, CustomModal } = useCustomModal({
        children: <>
            <div className="overflow-hidden w-full shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200 dark:bg-gray-800 dark:md:border-gray-800">
                <div className="flex flex-col px-4 py-6 pt-8 space-y-3 bg-white border-b border-gray-200 md:px-16 dark:bg-gray-800">
                    <h3 className="text-2xl w-full text-center font-bold font-display">API Key Manager</h3>
                    <form className="" onSubmit={handleSaveApiKey}>
                            <div className="mb-5">
                                <label htmlFor="apiKey" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your API Key</label>
                                <input type="text" id="apiKey" name="apiKey" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="AIzaSyBEacf_vOaWjyI6EwjR1f_MVwKz-6PuTBo" required />
                            </div>
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Submit
                            </button>
                            <p className="text-gray-400 mt-2 text-[10px]">
                                * Page will reload after submittion
                            </p>
                        </form>
                    <div>
                        <strong>
                            Current API Key:
                        </strong>
                        {apiKey}
                    </div>
                </div>
            </div>
        </>
    });
    return (
        <>
            <button
                onClick={() => setShowCustomModal(true)}
                type="button"
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                aria-label="Add API"
            >
                Add Your API Key
            </button>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                <button
                    type="button"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    aria-label="Add API"
                >
                    Get Your API Key
                </button>
            </a>
            <CustomModal />
        </>
    )
}
