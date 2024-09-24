import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { loadImage, createCanvas } from "canvas";
import { fileURLToPath } from "url";

const app = express();

// Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

app.use(express.json());
app.use("/outputs", express.static(path.join(__dirname, "outputs")));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Load the image, write text on it, and save the result
async function modifyImage(products, customer) {
  try {
    // Load the original image
    const img = await loadImage("./images/bg.png");

    let date =
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    // Create a canvas with the same dimensions as the image
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");

    // Draw the original image onto the canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);
    {
      // For Customer Address
      let customerName = customer.name;
      if (customerName.length > 45) {
        customerName = customerName.slice(0, 45) + "...";
      }
      let width = 600;
      let height = 80;
      const canvas2 = createCanvas(width, height);
      const ctx2 = canvas2.getContext("2d");
      ctx2.fillStyle = "transparent";
      ctx2.fillRect(0, 0, width, height);
      ctx2.fillStyle = "black";
      ctx2.font = "20px Poppins";
      ctx2.fontWeight = "800";
      ctx2.textBaseline = "middle";
      ctx2.fillText(customerName, 40, height / 2);
      // Draw the canvas2 on the main canvas
      ctx.drawImage(canvas2, 300, 560 - 80);
    }

    {
      // For Customer Address
      let address = customer.address;
      if (address.length > 45) {
        address = address.slice(0, 45) + "...";
      }
      let width = 620;
      let height = 80;
      const canvas2 = createCanvas(width, height);
      const ctx2 = canvas2.getContext("2d");
      ctx2.fillStyle = "transparent";
      ctx2.fillRect(0, 0, width, height);
      ctx2.fillStyle = "black";
      ctx2.font = "20px Poppins";
      ctx2.fontWeight = "800";
      // ctx2.textAlign = "center";
      ctx2.textBaseline = "middle";
      ctx2.fillText(address, 40, height / 2);
      // Draw the canvas2 on the main canvas
      ctx.drawImage(canvas2, 300, 640 - 80);
    }

    {
      // Current time
      let width = 390;
      let height = 80;
      const canvas2 = createCanvas(width, height);
      const ctx2 = canvas2.getContext("2d");
      ctx2.fillStyle = "transparent";
      ctx2.fillRect(0, 0, width, height);
      ctx2.fillStyle = "black";
      ctx2.font = "20px Poppins";
      ctx2.fontWeight = "800";
      ctx2.textAlign = "center";
      ctx2.textBaseline = "middle";
      ctx2.fillText(date, width / 2, height / 2);
      // Draw the canvas2 on the main canvas
      ctx.drawImage(canvas2, 1094, 642 - 158);
    }
    {
      // Current time
      let width = 390;
      let height = 80;
      const canvas2 = createCanvas(width, height);
      const ctx2 = canvas2.getContext("2d");
      ctx2.fillStyle = "transparent";
      ctx2.fillRect(0, 0, width, height);
      ctx2.fillStyle = "black";
      ctx2.font = "20px Poppins";
      ctx2.fontWeight = "800";
      ctx2.textAlign = "center";
      ctx2.textBaseline = "middle";
      ctx2.fillText("03001111598", width / 2, height / 2);
      // Draw the canvas2 on the main canvas
      ctx.drawImage(canvas2, 1094 - 80, 642 - 80);
    }
    let totalBill = 0;
    products.forEach((element, index) => {
      if (element.product !== "") {
        totalBill +=
          parseInt(element.quantity) * parseInt(element.singleItemPrice);
        {
          // create a new canvas with size of 123x85 and place it on the position of red bg, and write a text in the center of the newly created canvas and make sure that when text is larger then the size of the canvas, (...) will be written at the end to avoid overlapping
          // For Quantity
          let width = 123;
          let height = 85;
          const canvas2 = createCanvas(width, height);
          const ctx2 = canvas2.getContext("2d");
          ctx2.fillStyle = "transparent";
          ctx2.fillRect(0, 0, width, height);
          ctx2.fillStyle = "black";
          ctx2.font = "20px Poppins";
          ctx2.fontWeight = "800";
          ctx2.textAlign = "center";
          ctx2.textBaseline = "middle";
          ctx2.fillText(element.quantity, width / 2, height / 2);
          // Draw the canvas2 on the main canvas
          ctx.drawImage(canvas2, 165, 832 + 85 * index);
        }
        {
          // For Name of the Product Itself
          let name = element.product;
          if (name.length > 50) {
            name = name.slice(0, 50) + "...";
          }
          let width = 700;
          let height = 85;
          const canvas2 = createCanvas(width, height);
          const ctx2 = canvas2.getContext("2d");
          ctx2.fillStyle = "transparent";
          ctx2.fillRect(0, 0, width, height);
          ctx2.fillStyle = "black";
          ctx2.font = "20px Poppins";
          ctx2.fontWeight = "800";
          // ctx2.textAlign = "center";
          ctx2.textBaseline = "middle";
          ctx2.fillText(name, 20, height / 2);
          // Draw the canvas2 on the main canvas
          ctx.drawImage(canvas2, 290, 832 + 85 * index);
        }
        {
          // For the price of Single Item
          let width = 200;
          let height = 85;
          const canvas2 = createCanvas(width, height);
          const ctx2 = canvas2.getContext("2d");
          ctx2.fillStyle = "transparent";
          ctx2.fillRect(0, 0, width, height);
          ctx2.fillStyle = "black";
          ctx2.font = "20px Poppins";
          ctx2.fontWeight = "800";
          ctx2.textAlign = "center";
          ctx2.textBaseline = "middle";
          ctx2.fillText(element.singleItemPrice, width / 2, height / 2);
          // Draw the canvas2 on the main canvas
          ctx.drawImage(canvas2, 993, 832 + 85 * index);
        }

        {
          // Calculate the total price
          let width = 290;
          let height = 85;
          const canvas2 = createCanvas(width, height);
          const ctx2 = canvas2.getContext("2d");
          ctx2.fillStyle = "transparent";
          ctx2.fillRect(0, 0, width, height);
          ctx2.fillStyle = "black";
          ctx2.font = "20px Poppins";
          ctx2.fontWeight = "800";
          ctx2.textAlign = "center";
          ctx2.textBaseline = "middle";
          ctx2.fillText(
            parseInt(element.quantity) * parseInt(element.singleItemPrice) ==
              NaN
              ? "0"
              : parseInt(element.quantity) * parseInt(element.singleItemPrice),
            width / 2,
            height / 2
          );
          // Draw the canvas2 on the main canvas
          ctx.drawImage(canvas2, 1195, 832 + 85 * index);
        }
      }
    });

    {
      // Total Payable Bill
      let width = 300;
      let height = 90;
      const canvas2 = createCanvas(width, height);
      const ctx2 = canvas2.getContext("2d");
      ctx2.fillStyle = "transparent";
      ctx2.fillRect(0, 0, width, height);
      ctx2.fillStyle = "black";
      ctx2.font = "50px Poppins";
      ctx2.fontWeight = "800";
      ctx2.textAlign = "center";
      ctx2.textBaseline = "middle";
      ctx2.fillText(totalBill.toString(), width / 2, height / 2);
      // Draw the canvas2 on the main canvas
      ctx.drawImage(canvas2, 1190, 1685);
    }
    // FOR OFFICE USE
    {
      // Customer Name
      let name = customer.name;
      if (name.length > 30) {
        name = name.slice(0, 30) + "...";
      }
      let width = 500;
      let height = 80;
      const canvas2 = createCanvas(width, height);
      const ctx2 = canvas2.getContext("2d");
      ctx2.fillStyle = "transparent";
      ctx2.fillRect(0, 0, width, height);
      ctx2.fillStyle = "black";
      ctx2.font = "18px Poppins";
      ctx2.fontWeight = "800";
      ctx2.fillText(name, 0, height / 2 + 10);
      // Draw the canvas2 on the main canvas
      ctx.drawImage(canvas2, 300, img.height - 300 - 70);
    }
    {
      // Customer Address
      let address = customer.address;
      if (address.length > 47) {
        address = address.slice(0, 47) + "...";
      }
      let width = 520;
      let height = 80;
      const canvas2 = createCanvas(width, height);
      const ctx2 = canvas2.getContext("2d");
      ctx2.fillStyle = "transparent";
      ctx2.fillRect(0, 0, width, height);
      ctx2.fillStyle = "black";
      ctx2.font = "18px Poppins";
      ctx2.fontWeight = "800";
      ctx2.fillText(address, 50, height / 2 + 15);
      // Draw the canvas2 on the main canvas
      ctx.drawImage(canvas2, 300, img.height - 300);
    }

    {
      // Descripton of the products
      let descriptioin = products.reduce((acc, curr) => {
        return acc + curr.product + ", ";
      }, "");
      if (descriptioin.length > 47) {
        descriptioin = descriptioin.slice(0, 47) + "...";
      }
      let width = 435;
      let height = 50;
      const canvas2 = createCanvas(width, height);
      const ctx2 = canvas2.getContext("2d");
      ctx2.fillStyle = "transparent";
      ctx2.fillRect(0, 0, width, height);
      ctx2.fillStyle = "black";
      ctx2.font = "18px Poppins";
      ctx2.fontWeight = "800";
      ctx2.fillText(descriptioin, 0, height / 2 + 10);
      // Draw the canvas2 on the main canvas
      ctx.drawImage(canvas2, 400, img.height - 220);
    }
    {
      let width = 300;
      let height = 50;
      const canvas2 = createCanvas(width, height);
      const ctx2 = canvas2.getContext("2d");
      ctx2.fillStyle = "transparent";
      ctx2.fillRect(0, 0, width, height);
      ctx2.fillStyle = "black";
      ctx2.font = "24px Poppins";
      ctx2.fontWeight = "800";
      ctx2.textAlign = "center";
      ctx2.textBaseline = "middle";
      ctx2.fillText(totalBill, width / 2, height / 2 + 3);
      // Draw the canvas2 on the main canvas
      ctx.drawImage(canvas2, 830, img.height - 220);
    }
    // FOR OFFICE USE

    date = date.replaceAll("/", "-");
    // Save the image with text as a new file
    const out = fs.createWriteStream(
      path.join(
        "outputs",
        // track the file name with the customer name, date and time
        `${customer.name} ${date}.png`
      )
    );

    // make a4 landscape canvas and place the canvas on the left half of that canvas
    const a4Canvas = createCanvas(2480, 3508);
    const a4Ctx = a4Canvas.getContext("2d");
    a4Ctx.fillStyle = "white";
    a4Ctx.fillRect(0, 0, 2480, 3508);
    // rotate the previous canvas to 90 degree and place it on the left half of the a4 canvas
    a4Ctx.translate(0, 3508);
    a4Ctx.rotate(-0.5 * Math.PI);

    a4Ctx.drawImage(canvas, 10, 0, img.width, 2480);
    // a4Ctx.drawImage(canvas, img.width, 0, img.width, 2480);

    const stream = a4Canvas.createPNGStream();
    stream.pipe(out);
    // const stream = canvas.createJPEGStream();
    // stream.pipe(out);

    //return customer.name + " " + date + ".png";
    out.on("finish", () => {
      // return customer.name + " " + date + ".png";
      console.log("The JPEG file was created.");
    });

    return customer.name + " " + date + ".png";
  } catch (err) {
    console.error(err);
  }
}
app.post("/generate-bill", async (req, res) => {
  const { products, customer } = req.body;
  console.log(products);
  const fileURL = await modifyImage(products, customer);
  console.log(fileURL);
  res.json({ message: "Image generated successfully", fileURL });
});

// Path to suggestion.json
const suggestionFilePath = path.join(__dirname, "suggestion.json");

// Helper function to read the JSON file
const readSuggestions = () => {
  const data = fs.readFileSync(suggestionFilePath);
  return JSON.parse(data);
};

// Helper function to write to the JSON file
const writeSuggestions = (suggestions) => {
  fs.writeFileSync(suggestionFilePath, JSON.stringify(suggestions, null, 2));
};

// Route to get all suggestions
app.get("/suggestions", (req, res) => {
  const suggestions = readSuggestions();
  res.json(suggestions.suggestions);
});
// Route to add a new suggestion
app.post("/add-suggestion", (req, res) => {
  const { suggestion } = req.body;

  if (!suggestion || typeof suggestion !== "string") {
    return res
      .status(400)
      .json({ error: "Suggestion must be a non-empty string" });
  }

  const suggestionsData = readSuggestions();
  suggestionsData.suggestions.push(suggestion);

  writeSuggestions(suggestionsData);

  res.json({
    message: "Suggestion added successfully",
    suggestions: suggestionsData.suggestions,
  });
});

app.get("/me", (req, res) => {
  res.sendFile(path.join(__dirname, "outputs", "Asad.png"), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error sending image.");
    }
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
