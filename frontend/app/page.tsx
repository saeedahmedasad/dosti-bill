"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProductList() {
  const [productList, setProductList] = useState([
    { product: "", quantity: "", singleItemPrice: "" },
  ]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
  });
  const [isBillGenerated, setIsBillGenerated] = useState(false);
  const [billUrl, setBillUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]); // To store fetched suggestions
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]); // Filtered suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // Control suggestion visibility
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1); // Track active suggestion
  const [newSuggestion, setNewSuggestion] = useState("");
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);

  // Handle input change and dynamically add or remove rows
  const handleInputChange = async (
    index: number,
    field: string,
    value: string
  ) => {
    const newProductList = [...productList];
    newProductList[index][field as keyof (typeof newProductList)[number]] =
      value;
    setProductList(newProductList);

    if (field === "product" && value.length > 0) {
      // Fetch suggestions from backend when typing
      try {
        const { data } = await axios.get("http://localhost:4000/suggestions");
        setSuggestions(data); // Assuming data is an array of suggestions

        // Filter suggestions based on user input
        const filtered = data.filter((suggestion: string) =>
          suggestion.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setShowSuggestions(false); // Hide suggestions if input is cleared
    }

    // Add a new empty row if needed
    if (
      field === "singleItemPrice" &&
      newProductList[index].product !== "" &&
      value !== ""
    ) {
      if (index === productList.length - 1) {
        setProductList([
          ...productList,
          { product: "", quantity: "", singleItemPrice: "" },
        ]);
      }
    }

    // Handle removing empty row
    if (
      index === productList.length - 2 &&
      field === "singleItemPrice" &&
      value === ""
    ) {
      newProductList.pop();
      setProductList(newProductList);
    }

    // Remove any empty products rows
    for (let i = 0; i < newProductList.length - 1; i++) {
      if (
        newProductList[i].product === "" &&
        newProductList[i].quantity === "" &&
        newProductList[i].singleItemPrice === ""
      ) {
        setProductList(newProductList.filter((_, idx) => idx !== i));
      }
    }
  };

  const validateForm = () => {
    if (customerInfo.name.trim() === "" || customerInfo.address.trim() === "") {
      setError("براہ کرم کسٹمر کی تفصیلات شامل کریں۔");
      return false;
    }

    if (productList.length === 1 && productList[0].product.trim() === "") {
      setError("کم از کم ایک پروڈکٹ شامل کریں۔");
      return false;
    }

    for (let i = 0; i < productList.length; i++) {
      const item = productList[i];
      if (item.product.trim() !== "") {
        if (item.quantity === "" || item.singleItemPrice === "") {
          setError("اس پروڈکٹ کو مکمل کریں، آپ لکھ رہے ہیں۔");
          return false;
        }
        if (
          isNaN(Number(item.quantity)) ||
          isNaN(Number(item.singleItemPrice))
        ) {
          setError("Quantity اور Single Item Price عددی ہونا ضروری ہے۔");
          return false;
        }
        if (Number(item.quantity) <= 0 || Number(item.singleItemPrice) <= 0) {
          setError("Quantity اور Single Item Price 0 سے زیادہ ہونا ضروری ہے۔");
          return false;
        }
      }
    }

    return true;
  };

  const handleBillSubmit = async () => {
    if (!validateForm()) return;

    try {
      const { data } = await axios.post("http://localhost:4000/generate-bill", {
        products: productList,
        customer: customerInfo,
      });
      setTimeout(() => {
        setIsBillGenerated(true);
        setBillUrl(data.fileURL);
        handlePrint(data.fileURL);
      }, 1000);
    } catch (error) {
      console.error(error);
      setError("بل بنانے میں خرابی ہوئی۔ دوبارہ کوشش کریں۔");
    }
  };

  const handlePrint = (url: string) => {
    const imageUrl = `http://localhost:4000/outputs/${url}`;
    const printWindow = window.open(``, "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Image</title>
          </head>
          <body>
            <img src="${imageUrl}" style="width:100%;"/>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      setIsBillGenerated(false);
      setCustomerInfo({ name: "", address: "" });
      setProductList([{ product: "", quantity: "", singleItemPrice: "" }]);
    }
  };

  const handleSuggestionClick = (suggestion: string, index: number) => {
    const newProductList = [...productList];
    newProductList[index].product = suggestion;
    setProductList(newProductList);
    setShowSuggestions(false);
  };

  const handleAddSuggestion = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/add-suggestion",
        {
          suggestion: newSuggestion,
        }
      );
      setNewSuggestion(""); // Clear input after adding suggestion
      setShowSuggestionDialog(false);
      console.log("Suggestion added successfully:", data);
    } catch (error) {
      console.error("Error adding suggestion:", error);
    }
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
    } else if (e.key === "Enter") {
      if (
        activeSuggestionIndex >= 0 &&
        activeSuggestionIndex < filteredSuggestions.length
      ) {
        handleSuggestionClick(
          filteredSuggestions[activeSuggestionIndex],
          index
        );
      }
    }
  };

  // Handle global key presses
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleBillSubmit();
      }
      if (e.key === "Escape") {
        setError(null);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [productList, customerInfo]);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      {/* Get Customer Details */}
      <h2 className="text-lg font-bold mb-4">Customer Details</h2>
      <div className="flex gap-3 mb-4 text-black">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerInfo.name}
          autoFocus
          className="border rounded p-2 flex-1"
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Customer Address"
          value={customerInfo.address}
          className="border rounded p-2 flex-1"
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, address: e.target.value })
          }
        />
      </div>

      <h2 className="text-lg font-bold mb-4">Product List</h2>
      <div className="flex items-start justify-center gap-3 bg-green-600 p-2 mb-3 rounded-md font-bold">
        <h1 className="flex-1 text-center text-xl">Product Name</h1>
        <h1 className="flex-1 text-center text-xl">Quantity</h1>
        <h1 className="flex-1 text-center text-xl">Price per item</h1>
      </div>
      {productList.map((item, index) => (
        <div key={index} className="flex gap-3 mb-4 text-black relative">
          <input
            type="text"
            placeholder="Product Name"
            value={item.product}
            onChange={(e) =>
              handleInputChange(index, "product", e.target.value)
            }
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="border rounded p-2 flex-1"
            onFocus={() => setShowSuggestions(true)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) =>
              handleInputChange(index, "quantity", e.target.value)
            }
            className="border rounded p-2 flex-1"
          />
          <input
            type="number"
            placeholder="Price per item"
            value={item.singleItemPrice}
            onChange={(e) =>
              handleInputChange(index, "singleItemPrice", e.target.value)
            }
            className="border rounded p-2 flex-1"
          />

          {/* Display suggestions if available */}
          {showSuggestions &&
            filteredSuggestions.length > 0 &&
            index === productList.length - 1 && (
              <ul className="absolute z-10 top-full left-0 w-full bg-white border rounded shadow-lg mt-1">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((suggestion, i) => (
                    <li
                      key={i}
                      className={`p-2 hover:bg-gray-200 cursor-pointer ${
                        i === activeSuggestionIndex ? "bg-gray-300" : ""
                      }`}
                      onClick={() => handleSuggestionClick(suggestion, index)}
                    >
                      {suggestion}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">
                    No suggestions available
                  </li>
                )}
              </ul>
            )}
        </div>
      ))}

      {error && (
        <div className="text-white text-sm mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="w-full flex justify-between py-2">
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleBillSubmit}
        >
          Generate Bill
        </button>

        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={() => {
            setShowSuggestionDialog(true);
          }}
        >
          Add Suggestion
        </button>
      </div>

      {showSuggestionDialog && (
        <div className="mt-4">
          <h3 className="font-bold">Add New Suggestion</h3>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Add a new suggestion"
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
              className="border p-2 rounded text-black"
            />
            <button
              className="bg-green-500 text-white p-2 rounded"
              onClick={handleAddSuggestion}
            >
              Add Suggestion
            </button>
          </div>
        </div>
      )}

      {isBillGenerated && (
        <div className="mt-6 text-green-600 text-sm">
          Bill generated successfully! Printing...
        </div>
      )}
    </div>
  );
}
