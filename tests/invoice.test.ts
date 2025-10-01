import request from "supertest";
import app from "../src/index";
import prisma from "../prisma/client";

describe("Invoice API (integration)", () => {
  let invoiceId: string;

  afterAll(async () => {
    await prisma.invoice.deleteMany({});
    await prisma.$disconnect();
  });

  it("creates an invoice", async () => {
    const res = await request(app)
      .post("/invoices")
      .send({ number: "TEST-001", totalCents: 10000 });
    expect(res.status).toBe(201);
    expect(res.body.number).toBe("TEST-001");
    invoiceId = res.body.id;
  });

  it("issues the invoice", async () => {
    const res = await request(app).post(`/invoices/${invoiceId}/issue`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ISSUED");
  });

  it("cancels the invoice", async () => {
  const res = await request(app).post(`/invoices/${invoiceId}/cancel`);
  expect(res.status).toBe(200);
  expect(res.body.status).toBe("CANCELED");
  });

  it("generates pdf", async () => {
    const res = await request(app).post(`/invoices/${invoiceId}/generate-pdf`);
    expect(res.status).toBe(200);
    expect(res.body.pdfPath).toBeDefined();
  });

  it("downloads pdf", async () => {
  const res = await request(app)
    .get(`/invoices/${invoiceId}/pdf`)
    .buffer(true)
    .parse((res, callback) => {
      res.setEncoding("binary");
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        callback(null, Buffer.from(data, "binary"));
      });
    });

  expect(res.status).toBe(200);
  expect(res.headers["content-type"]).toBe("application/pdf");
  expect(res.body).toBeInstanceOf(Buffer);
  expect(res.body.length).toBeGreaterThan(0);
  });

  it("deletes invoice", async () => {
  const res = await request(app).delete(`/invoices/${invoiceId}`);
  expect(res.status).toBe(204);
  });
 
  
});
