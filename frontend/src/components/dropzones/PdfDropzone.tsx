import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfDropzoneProps {
  onFileAccepted: (file: File) => void;
}

export default function PdfDropzone({ onFileAccepted }: PdfDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
      },
      multiple: false,
      maxSize: 10 * 1024 * 1024, // 10MB
      onDropAccepted: (files) => {
        onFileAccepted(files[0]);
      },
    });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-8 text-center cursor-pointer transition",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted hover:border-primary/60"
        )}
      >
        <input {...getInputProps()} />

        <Upload className="h-6 w-6 text-muted-foreground" />

        <p className="text-sm">
          <span className="font-medium text-primary">Click to upload</span> or
          drag and drop
        </p>

        <p className="text-xs text-muted-foreground">
          PDF only · Text will be extracted
        </p>
      </div>

      {fileRejections.length > 0 && (
        <p className="text-xs text-destructive">
          Invalid file. Please upload a PDF under 10MB.
        </p>
      )}
    </div>
  );
}
