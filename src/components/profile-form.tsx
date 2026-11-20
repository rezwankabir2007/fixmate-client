
"use client";

import * as React from "react";
import type { ChangeEvent, FormEvent } from "react";
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

  const [currentName, setCurrentName] = React.useState(name);
  const [currentImage, setCurrentImage] = React.useState<string | null>(
    image ?? null,
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const displayedImage = previewUrl ?? currentImage;

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const getInitials = (value: string) => {
    return (
      value
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "U"
    );
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess("");

    const file = event.target.files?.[0];

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

    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = currentName.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    setPending(true);

    try {
      let imageUrl = currentImage;

      // Upload selected image first.
      if (selectedFile) {
        const formData = new FormData();

        // Backend expects the field name "image".
        formData.append("image", selectedFile);

        const uploadResponse = await fetch(
          "/api/upload/profile-image",
          {
            method: "POST",
            body: formData,
          },
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.secure_url) {
          throw new Error(
            uploadResult.error ||
              uploadResult.message ||
              "Image upload failed. Please try again.",
          );
        }

        imageUrl = uploadResult.secure_url;
      }

      // Update profile information.
      const profileResponse = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          image: imageUrl,
        }),
      });

      const profileResult = await profileResponse.json();

      if (!profileResponse.ok || profileResult.success === false) {
        throw new Error(
          profileResult.error ||
            profileResult.message ||
            "Profile update failed. Please try again.",
        );
      }

      setCurrentName(trimmedName);
      setCurrentImage(imageUrl);
      setSelectedFile(null);
      setPreviewUrl(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess("Your profile has been updated successfully.");

      // Notify Navbar about the updated profile image.
      window.dispatchEvent(
        new CustomEvent("fixmate:profile-updated", {
          detail: {
            image: imageUrl,
          },
        }),
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setPending(false);
    }
  };

  const handleReset = () => {
    setCurrentName(name);
    setCurrentImage(image ?? null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Personal information
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your profile details and profile photo.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-20 border border-border">
          {displayedImage ? (
            <AvatarImage src={displayedImage} alt={currentName} />
          ) : null}
          <AvatarFallback className="text-lg">
            {getInitials(currentName)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Profile photo
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            disabled={pending}
            className="block w-full max-w-xs text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90 disabled:opacity-50"
          />

          <p className="text-xs text-muted-foreground">
            JPG, PNG, WEBP or GIF. Maximum size 2MB.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="profile-name"
          className="text-sm font-medium text-foreground"
        >
          Full name
        </label>

        <Input
          id="profile-name"
          name="name"
          value={currentName}
          onChange={(event) => setCurrentName(event.target.value)}
          placeholder="Enter your full name"
          disabled={pending}
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="profile-email"
          className="text-sm font-medium text-foreground"
        >
          Email address
        </label>

        <Input
          id="profile-email"
          name="email"
          type="email"
          value={email}
          disabled
          readOnly
        />

        <p className="text-xs text-muted-foreground">
          Your email address cannot be changed here.
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300"
        >
          {error}
        </p>
      ) : null}

      {success ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300"
        >
          {success}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving changes..." : "Save changes"}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
