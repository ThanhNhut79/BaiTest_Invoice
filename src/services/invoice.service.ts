
import { PrismaClient, InvoiceStatus } from "@prisma/client";
import { createInvoicePDF } from "../utils/pdf";
import path from "path";

const prisma = new PrismaClient();

export async function create(data: any) {
  return prisma.invoice.create({ data });
}

export async function findAll() {
  return prisma.invoice.findMany();
}

export async function findById(id: string) {
  return prisma.invoice.findUnique({ where: { id } });
}

export async function update(id: string, data: any) {
  return prisma.invoice.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.invoice.delete({ where: { id } });
}

export async function changeStatus(id: string, status: InvoiceStatus) {
  return prisma.invoice.update({ where: { id }, data: { status } });
}

export async function replace(id: string, data: any) {
  const newInvoice = await prisma.invoice.create({ data });
  await prisma.invoice.update({
    where: { id },
    data: { replacedById: newInvoice.id }
  });
  return newInvoice;
}

export async function generatePDF(id: string) {
  const invoice = await findById(id);
  if (!invoice) throw new Error("Invoice not found");

  const pdfPath = path.join("pdfs", `${invoice.number}.pdf`);
  await createInvoicePDF(invoice, pdfPath);

  await prisma.invoice.update({
    where: { id },
    data: { pdfPath }
  });

  return pdfPath;
}

export async function getPDFPath(id: string) {
  const invoice = await findById(id);
  return invoice?.pdfPath || null;
}
