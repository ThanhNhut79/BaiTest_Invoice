
import express from "express";
import bodyParser from "body-parser";
import invoiceRoutes from "./routes/invoice.routes";

const app = express();
app.use(bodyParser.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/invoices", invoiceRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
export default app;