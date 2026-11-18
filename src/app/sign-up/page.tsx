"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Camera,
  ShieldCheck,
  UserCircle2,
  Wrench,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { authClient, type AuthSessionUser } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { dashboardPathForRole, isUserRole } from "@/lib/user-role";

const roleOptions = [
  {
    value: "customer",
    label: "Customer",
    description: "Book repairs and manage service history.",
    icon: UserCircle2,
  },
  {
    value: "technician",
    label: "Technician",
    description: "Accept assignments and manage jobs.",
    icon: Wrench,
  },
] as const;

const MAX_IMAGE_SIZE_MB = 2;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// ফাইলকে Base64 স্ট্রিং-এ রূপান্তর করার হেল্পার ফাংশন
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export default function SignUpPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");

  // ইমেজের জন্য নতুন স্টেট
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ফাইল টাইপ ভ্যালিডেশন
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG, WEBP, or GIF).");
      event.target.value = "";
      return;
    }

    // ফাইল সাইজ ভ্যালিডেশন (সর্বোচ্চ 2MB)
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image size must be less than ${MAX_IMAGE_SIZE_MB}MB.`);
      event.target.value = "";
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    // Name validation
    if (normalizedName.length < 2 || normalizedName.length > 80) {
      toast.error("Enter a name between 2 and 80 characters.");
      return;
    }

    // Password length validation
    if (password.length < 8 || password.length > 128) {
      toast.error("Password must be between 8 and 128 characters.");
      return;
    }

    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }

    // At least one lowercase letter
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }

    // At least one number
    if (!/[0-9]/.test(password)) {
      toast.error("Password must contain at least one number.");
      return;
    }

    // At least one special character (not a letter, number, or whitespace)
    if (!/[^\w\s]/.test(password)) {
      toast.error("Password must contain at least one special character.");
      return;
    }

    setBusy(true);

    let accountCreated = false;

    try {
      let imageUrl: string | undefined = undefined;

      if (imageFile) {
        // অপশন ১: সরাসরি Base64 হিসেবে পাঠানো (কোনো এক্সট্রা API ছাড়াই কাজ করবে)
        imageUrl = await fileToBase64(imageFile);

        /* 
        // অপশন ২: আপনি যদি Cloudinary বা নিজের /api/upload ব্যবহার করতে চান, 
        // তবে উপরের লাইনটি কমেন্ট করে নিচের কোডটি ব্যবহার করুন:
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          throw new Error("Failed to upload profile image.");
        }
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
        */
      }

      const result = await authClient.signUp.email({
        name: normalizedName,
        email: normalizedEmail,
        password,
        role,
        ...(imageUrl ? { image: imageUrl } : {}),
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (result.error) {
        toast.error(
          getAuthErrorMessage(
            result.error,
            "Unable to create your FixMate account."
          )
        );
        return;
      }

      accountCreated = true;

      toast.success("Your FixMate account was created successfully!");

      const sessionResponse = await authClient.getSession();

      const sessionUser = sessionResponse.data?.user as
        | AuthSessionUser
        | undefined;

      if (!sessionResponse.error && sessionUser && isUserRole(sessionUser.role)) {
        router.replace(dashboardPathForRole(sessionUser.role));
        router.refresh();
        return;
      }

      toast.info("Please sign in to continue.");
    } catch (submitError) {
      if (accountCreated) {
        toast.info(
          "Your account was created, but we couldn't verify your session. Please sign in."
        );
      } else {
        toast.error(
          getAuthErrorMessage(
            submitError,
            "Unable to create your FixMate account."
          )
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-200">
              <ShieldCheck className="size-4" />
              Secure account setup
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                Create your account
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                Join FixMate as a customer or technician.
              </h1>
            </div>

            <div className="grid gap-4">
              {roleOptions.map(({ value, label, description, icon: Icon }) => {
                const selected = role === value;

                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setRole(value)}
                    disabled={busy}
                    aria-pressed={selected}
                    className={`rounded-[24px] border p-4 text-left transition-all ${
                      selected
                        ? "border-blue-500/40 bg-blue-500/8 shadow-[0_14px_40px_rgba(52,120,246,0.12)]"
                        : "border-border bg-card/80"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(52,120,246,0.14),rgba(54,185,154,0.12))] text-blue-600 dark:text-blue-300">
                        <Icon className="size-4" />
                      </div>

                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          {label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Card className="border-border bg-card/80 shadow-[0_22px_60px_rgba(23,36,59,0.08)]">
            <CardHeader className="space-y-2 px-6 pt-6">
              <CardTitle className="text-2xl">Sign up</CardTitle>
              <CardDescription>
                Choose your role and start managing repairs faster.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* প্রোফাইল ইমেজ আপলোড সেকশন */}
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile photo (optional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 shrink-0">
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            className="size-16 rounded-full border border-border object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={busy}
                            aria-label="Remove profile photo"
                            className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition hover:opacity-90"
                          >
                            <X className="size-3" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={busy}
                          className="flex size-16 items-center justify-center rounded-full border border-dashed border-border bg-muted/40 text-muted-foreground transition hover:border-blue-500/50 hover:text-blue-600"
                        >
                          <Camera className="size-5" />
                        </button>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {imageFile ? "Change photo" : "Upload photo"}
                        </Button>
                        {imageFile && (
                          <span className="max-w-[140px] truncate text-xs text-muted-foreground">
                            {imageFile.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, WEBP or GIF. Max {MAX_IMAGE_SIZE_MB}MB.
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      id="avatar"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageChange}
                      disabled={busy}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a secure password"
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    required
                  />

                  <p className="text-xs text-muted-foreground">
                    8–128 characters, including uppercase, lowercase, number
                    and special character.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20"
                >
                  {busy ? "Creating account..." : "Create account"}
                  <ArrowRight className="size-4" />
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-blue-600 dark:text-blue-300"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}