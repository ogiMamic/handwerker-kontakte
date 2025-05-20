"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onUpload: (urls: string[]) => void
  maxFiles?: number
  acceptedFileTypes?: string[]
  maxSize?: number
}

export function FileUploader({
  onUpload,
  maxFiles = 5,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSize = 5 * 1024 * 1024, // 5MB
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)

      // Check if adding these files would exceed the max files limit
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files.`)
        return
      }

      // Filter out files that are too large
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSize) {
          setError(`File "${file.name}" is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`)
          return false
        }
        return true
      })

      setFiles((prev) => [...prev, ...validFiles])
    },
    [files.length, maxFiles, maxSize],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    maxFiles: maxFiles - files.length,
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      // In a real application, you would upload the files to a server here
      // For this example, we'll simulate a successful upload with placeholder URLs
      const uploadedUrls = files.map(
        (file, index) => `/placeholder.svg?height=300&width=400&query=uploaded image ${index + 1}`,
      )

      onUpload(uploadedUrls)
      setFiles([])
    } catch (err) {
      setError("An error occurred while uploading the files. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive ? "Drop the files here..." : "Drag & drop files here, or click to select files"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Accepted file types: {acceptedFileTypes.join(", ")} (Max {maxSize / (1024 * 1024)}MB)
        </p>
      </div>

      {error && <div className="text-sm text-red-500 p-2 bg-red-50 rounded">{error}</div>}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Selected files ({files.length}/{maxFiles}):
          </p>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-6 w-6">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </li>
            ))}
          </ul>
          <Button type="button" onClick={handleUpload} disabled={uploading} className="w-full">
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      )}
    </div>
  )
}
