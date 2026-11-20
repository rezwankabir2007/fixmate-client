
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type ProfileFormProps = {
  name: string;
  email: string;
  image?: string | null;
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export function ProfileForm({
  name,
  email,
  image,
}: ProfileFormProps) {
  const router = useRouter();

  const [value, setValue] = useState(name);
  const [currentImage, setCurrentImage] = useState(image ?? null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!previewUrl) return;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function getInitials() {
    return (
      value
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "U"
    );
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP, or GIF image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image must be 2MB or smaller.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPending(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = currentImage;

      // Step 1: Upload selected image to Cloudinary.
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadResponse = await fetch(
          "/api/upload/profile-image",
          {
            method: "POST",
            body: formData,
          },
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadResult.error ?? "Image upload failed.",
          );
        }

        if (
          typeof uploadResult.secure_url !== "string" ||
          !uploadResult.secure_url
        ) {
          throw new Error("Cloudinary did not return an image URL.");
        }

        imageUrl = uploadResult.secure_url;
      }

      // Step 2: Save name and image URL to the user profile.
      const response = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: value,
          ...(selectedFile ? { image: imageUrl } : {}),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Your profile could not be updated.",
        );
      }

      setCurrentImage(imageUrl);
      setSelectedFile(null);
      setPreviewUrl(null);

      setSuccess("Your profile has been updated successfully.");

      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Your profile could not be updated.",
      );
    } finally {
      setPending(false);
    }
  }

  const displayedImage = previewUrl || currentImage;

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-[24px] border border-border bg-card/80 p-5 shadow-[0_18px_40px_rgba(23,36,59,0.05)] sm:p-6"
    >
      <div className="space-y-3">
        <p className="text-sm font-medium">Profile photo</p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-24 border-2 border-border">
            {displayedImage ? (
              <AvatarImage src={displayedImage} alt="Profile photo" />
            ) : null}

            <AvatarFallback className="bg-blue-500/10 text-xl font-semibold text-blue-700 dark:text-blue-200">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-2">
            <label
              htmlFor="profile-image"
              className="block text-sm font-medium"
            >
              Choose a new photo
            </label>

            <Input
              id="profile-image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={pending}
              onChange={handleImageChange}
              className="cursor-pointer file:mr-3 file:rounded-full file:border-0 file:bg-blue-500/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-blue-700 dark:file:text-blue-200"
            />

            <p className="text-xs text-muted-foreground">
              JPG, PNG, WEBP or GIF. Maximum file size: 2MB.
            </p>

            {selectedFile ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-300">
                Selected: {selectedFile.name}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      <label className="block space-y-2 text-sm font-medium">
        Full name

        <Input
          name="name"
          minLength={2}
          maxLength={80}
          required
          value={value}
          disabled={pending}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>

      <label className="block space-y-2 text-sm font-medium">
        Email

        <Input value={email} readOnly aria-describedby="email-note" />

        <span
          id="email-note"
          className="block text-xs font-normal text-muted-foreground"
        >
          Email changes are not enabled in this workspace.
        </span>
      </label>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-300"
        >
          {error}
        </p>
      ) : null}

      {success ? (
        <p
          role="status"
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-300"
        >
          {success}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white"
      >
        {pending
          ? "Uploading and saving..."
          : "Save profile"}
      </Button>
    </form>
  );
}
