
import { Router } from "express";
import * as InvoiceController from "../controllers/invoice.controller";

const router = Router();

router.post("/", InvoiceController.createInvoice);
router.get("/", InvoiceController.getInvoices);
router.get("/:id", InvoiceController.getInvoice);
router.put("/:id", InvoiceController.updateInvoice);
router.delete("/:id", InvoiceController.deleteInvoice);

router.post("/:id/issue", InvoiceController.issueInvoice);
router.post("/:id/cancel", InvoiceController.cancelInvoice);
router.post("/:id/replace", InvoiceController.replaceInvoice);

router.post("/:id/generate-pdf", InvoiceController.generatePDF);
router.get("/:id/pdf", InvoiceController.downloadPDF);

export default router;
