"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X } from "lucide-react"

interface FileUploaderProps {
  onUpload: (urls: string[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
  acceptedFileTypes?: string[]
}

export function FileUploader({
  onUpload,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
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
          setError(`File "${file.name}" is too large. Maximum size is ${maxSize / 1024 / 1024}MB.`)
          return false
        }
        return true
      })

      setFiles((prev) => [...prev, ...validFiles])
    },
    [files, maxFiles, maxSize],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxSize,
    maxFiles: maxFiles - files.length,
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)

    try {
      // Simulate file upload with progress
      // In a real app, you would use your file upload service here
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // For demo purposes, we're using placeholder images
        // In a real app, you would get the URL from your upload service
        uploadedUrls.push(`/placeholder.svg?height=400&width=400&query=construction project image ${i + 1}`)

        // Update progress
        setProgress(((i + 1) / files.length) * 100)
      }

      // Call the onUpload callback with the uploaded URLs
      onUpload(uploadedUrls)

      // Clear the files
      setFiles([])
    } catch (err) {
      setError("An error occurred while uploading files. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive ? "Drop the files here..." : "Drag & drop files here, or click to select files"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max {maxFiles} files, up to {maxSize / 1024 / 1024}MB each
        </p>
      </div>

      {error && <div className="text-sm text-red-500 p-2 bg-red-50 rounded">{error}</div>}

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">
            Selected Files ({files.length}/{maxFiles})
          </div>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="text-xs text-gray-500">File</div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-medium truncate" title={file.name}>
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={uploading}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </li>
            ))}
          </ul>

          {uploading ? (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-center text-gray-500">Uploading... {Math.round(progress)}%</p>
            </div>
          ) : (
            <Button onClick={uploadFiles} className="w-full">
              Upload {files.length} {files.length === 1 ? "file" : "files"}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
