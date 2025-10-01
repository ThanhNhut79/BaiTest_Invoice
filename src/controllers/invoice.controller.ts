
import { Request, Response } from "express";
import * as InvoiceService from "../services/invoice.service";

export const createInvoice = async (req: Request, res: Response) => {
  const invoice = await InvoiceService.create(req.body);
  res.status(201).json(invoice);
};

export const getInvoices = async (_: Request, res: Response) => {
  res.json(await InvoiceService.findAll());
};

export const getInvoice = async (req: Request, res: Response) => {
  const invoice = await InvoiceService.findById(req.params.id);
  invoice ? res.json(invoice) : res.status(404).json({ error: "Not found" });
};

export const updateInvoice = async (req: Request, res: Response) => {
  const invoice = await InvoiceService.update(req.params.id, req.body);
  res.json(invoice);
};

export const deleteInvoice = async (req: Request, res: Response) => {
  await InvoiceService.remove(req.params.id);
  res.status(204).send();
};

export const issueInvoice = async (req: Request, res: Response) => {
  res.json(await InvoiceService.changeStatus(req.params.id, "ISSUED"));
};

export const cancelInvoice = async (req: Request, res: Response) => {
  res.json(await InvoiceService.changeStatus(req.params.id, "CANCELED"));
};

export const replaceInvoice = async (req: Request, res: Response) => {
  res.json(await InvoiceService.replace(req.params.id, req.body));
};

export const generatePDF = async (req: Request, res: Response) => {
  const path = await InvoiceService.generatePDF(req.params.id);
  res.json({ pdfPath: path });
};

export const downloadPDF = async (req: Request, res: Response) => {
  const file = await InvoiceService.getPDFPath(req.params.id);
  if (!file) return res.status(404).json({ error: "No PDF found" });
  res.download(file);
};
