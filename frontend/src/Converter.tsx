import { useState } from "react";
import Header from "./components/Header";
import {
  convertMetricToMetric,
  convertImperialToMetric,
  convertMetricToImperial,
  convertImperialToImperial,
} from "./api/converter";

const Converter = () => {
  const [selectedConversion, setSelectedConversion] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleConversion = async () => {
    let response = null;
    const inputArray = inputValue.split(",").map(Number);

    switch (selectedConversion) {
      case "metric-to-imperial":
        response = await convertMetricToImperial(inputArray);
        setResult(response ? response.pounds.join(", ") : "Error");
        break;
      case "imperial-to-metric":
        response = await convertImperialToMetric(inputArray);
        setResult(response ? response.grams.join(", ") : "Error");
        break;
      case "metric-to-metric":
        response = await convertMetricToMetric(inputArray);
        setResult(response ? response.milligrams.join(", ") : "Error");
        break;
      case "imperial-to-imperial":
        response = await convertImperialToImperial(inputArray);
        setResult(response ? response.teaspoons.join(", ") : "Error");
        break;
      default:
        setResult("Please select a conversion type.");
        break;
    }
  };

  return (
    <Header pageName="Unit Converter">
      <div className="flex justify-center mt-6">
        <div className="w-[500px] bg-gray-100 rounded shadow border">
          <div className="py-2 px-3 bg-orange-500 rounded-tl rounded-tr">
            <h1 className="text-white font-bold text-xl">Unit Converter</h1>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-gray-700">Select Conversion Type:</label>
              <select
                value={selectedConversion}
                onChange={(e) => setSelectedConversion(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="">Select a conversion</option>
                <option value="metric-to-imperial">Grams to Pounds</option>
                <option value="imperial-to-metric">Pounds to Grams</option>
                <option value="metric-to-metric">Milligrams to Grams</option>
                <option value="imperial-to-imperial">Tablespoons to Teaspoons</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Enter Values (comma separated):</label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <button
              onClick={handleConversion}
              className="w-full bg-orange-500 text-white p-2 rounded"
            >
              Convert
            </button>
            {result && (
              <div className="mt-4">
                <label className="block text-gray-700">Result:</label>
                <div className="mt-1 p-2 border rounded bg-white">{result}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Header>
  );
};

export default Converter;
