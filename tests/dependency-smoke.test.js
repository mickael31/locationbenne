import assert from "node:assert/strict";
import test from "node:test";

import nodemailer from "nodemailer";

test("Nodemailer 9 keeps the transport API used by the server", async () => {
  const transporter = nodemailer.createTransport({ jsonTransport: true });
  const result = await transporter.sendMail({
    from: "sender@example.com",
    to: "recipient@example.com",
    subject: "Local dependency smoke test",
    text: "No network request is made by the JSON transport.",
  });

  assert.deepEqual(result.envelope.to, ["recipient@example.com"]);
  assert.match(result.message.toString(), /Local dependency smoke test/);
});
