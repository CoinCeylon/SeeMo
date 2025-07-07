"use client";

import * as React from "react";
import SchemaBuilder from "@/app/Generate/schema-builder";
import CSVUpload from "@/app/Generate/csvInput";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { downloadQRCodesFromRefs } from "@/lib/downloadQR";
import { useRef } from "react";

import { QRCodeSVG } from "qrcode.react";
import { z } from "zod";
import { CheckCircle2Icon } from "lucide-react";

type FieldType = "string" | "number" | "boolean";

type ColumnPreview = {
  name: string;
  include: boolean;
  type: FieldType;
  isPrimaryKey: boolean;
};

function getRowForQR(row: any, columns: ColumnPreview[]) {
  const visibleCols = columns.filter((c) => c.include);
  return Object.fromEntries(visibleCols.map((c) => [c.name, row[c.name]]));
}

async function hashRow(row: object): Promise<string> {
  const encoder = new TextEncoder();
  const dataStr = JSON.stringify(row);
  const data = encoder.encode(dataStr);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function DataTable() {
  const [submitted, setSubmitted] = React.useState(false);
  const qrRefs = useRef<(SVGSVGElement | null)[]>([]);
  const [columns, setColumns] = React.useState<ColumnPreview[]>([]);
  const [previewData, setPreviewData] = React.useState<any[]>([]);
  const [schema, setSchema] = React.useState<z.ZodObject<any>>(); // For schema validation
  const [data, setData] = React.useState<any[]>([]); // Validated rows
  const [hashes, setHashes] = React.useState<
    { row: any; hash: string; txHash?: string }[]
  >([]);

  const handleSchemaConfirm = () => {
    const shape: Record<string, any> = {};
    for (const col of columns) {
      if (!col.include) continue;
      shape[col.name] =
        col.type === "number"
          ? z.string().or(z.number())
          : col.type === "boolean"
          ? z.boolean().or(z.string())
          : z.string();
    }

    const generated = z.object(shape);
    setSchema(generated);

    const validated = previewData
      .map((row) => {
        try {
          return generated.parse(row);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    setData(validated as any[]);
  };

  return (
    <Tabs defaultValue="load" className="w-full flex-col gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList className="w-full justify-between">
          <TabsTrigger value="load">1. Load Data</TabsTrigger>
          <TabsTrigger value="send">2. Process Data</TabsTrigger>
          <TabsTrigger value="get">3. Submit</TabsTrigger>
        </TabsList>
      </div>

      {/* Load CSV */}
      <TabsContent value="load" className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed p-4 space-y-4">
          <CSVUpload
            onPreview={(cols, rows) => {
              setColumns(
                cols.map((col) => ({
                  ...col,
                  isPrimaryKey: false, // Irrelevant now
                }))
              );
              setPreviewData(rows);
              setSchema(undefined);
              setData([]);
              setHashes([]);
            }}
          />

          {columns.length > 0 && (
            <SchemaBuilder columns={columns} onChange={setColumns} />
          )}

          {columns.length > 0 && (
            <Button onClick={handleSchemaConfirm}>Load & Validate Data</Button>
          )}

          {data.length > 0 && (
            <pre className="mt-4 rounded-md bg-muted p-4 text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </TabsContent>

      {/* Generate Hashes */}
      <TabsContent value="send" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed p-4 space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                const newHashes = await Promise.all(
                  data.map(async (row) => {
                    const hash = await hashRow(row);
                    return { row, hash };
                  })
                );
                setHashes(newHashes);
              }}
            >
              Generate Hashes
            </Button>
          </div>
          <Alert variant="default" className="flex-1">
            <CheckCircle2Icon />
            <AlertDescription>
              Only the hash will be sent to the blockchain. Original data stays
              private.
            </AlertDescription>
          </Alert>
          {hashes.map((row, i) => (
            <div key={i} className="p-2 min-w-auto border rounded-md text-xs">
              <pre className="mt-2 whitespace-pre-wrap break-words">
                {JSON.stringify({ hash: row.hash }, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Get Transaction Hashes & QR Codes */}
      <TabsContent value="get" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed p-4">
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                try {
                  const rawHashes = hashes.map((item) => item.hash);
                  const res = await fetch(
                    "http://localhost:3000/api/upload-hashes",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ hashes: rawHashes }),
                    }
                  );

                  const txHash: string = await res.json(); // Single tx hash returned
                  const hashesWithTx = hashes.map((item) => ({

                    ...item,
                    txHash,
                  }));

                  setHashes(hashesWithTx);
                  setSubmitted(true);
                  alert("Transaction hashes received and saved.");
                } catch (err) {
                  console.error(err);
                  alert("Failed to send.");
                }
              }}
              disabled={hashes.length === 0}
            >
              Send Data to Server
            </Button>

            <Button
              className="mb-4"
              onClick={() => downloadQRCodesFromRefs(qrRefs.current)}
              disabled={!submitted}
            >
              Download All QR Codes
            </Button>
          </div>
          <Alert variant="default" className="flex-1 mb-4">
            <CheckCircle2Icon />
            <AlertDescription>
              Download available only after successful submission to server.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {hashes.map((row, i) => {
              if (!row.txHash) return null;

              const qrPayload = {
                product_hash: row.hash,
                tx_hash: row.txHash,
              };

              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center p-2 bg-white border rounded-md text-xs min-w-[120px]"
                >
                  <QRCodeSVG
                    value={JSON.stringify(qrPayload)}
                    size={110}
                    ref={(el) => {
                      qrRefs.current[i] = el;
                    }}
                  />
                  <pre className="mt-2 text-black">
                    {row.hash.slice(0, 10)}...
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
