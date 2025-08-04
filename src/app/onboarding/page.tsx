"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const [vendorName, setVendorName] = useState("");
  const [slug, setSlug] = useState("");
  const [bio, setBio] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("vendors")
      .insert({
        user_id: user.id,
        name: vendorName,
        slug,
        bio,
        whatsapp_url: whatsappUrl || null,
        instagram_handle: instagramHandle || null,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      console.log("Vendor saved:", data);
      router.push(`/store/${data.slug}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 max-w-md w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">
        Let’s Set Up Your ShopLink 🚀
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        This is what customers will see when they visit your store page.
      </p>

      {error && (
        <div className="text-sm text-red-500 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        <div className="space-y-2">
          <Label htmlFor="vendorName" className="text-sm font-medium">
            Business Name
          </Label>
          <Input
            id="vendorName"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="Zara Kitchen"
            className="text-base h-10 mt-1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="text-sm font-medium">
            Store Link (Slug)
          </Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="zara-kitchen"
            className="text-base h-10 mt-1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium">
            Short Bio
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="We make delicious local meals fresh every day."
            className="text-base mt-1"
          />
        </div>

        {/* Social Links Grouping */}
        <h2 className="text-sm font-medium text-muted-foreground mt-6">
          Social Links
        </h2>

        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="text-sm font-medium">
            WhatsApp Link
          </Label>
          <Input
            id="whatsapp"
            value={whatsappUrl}
            onChange={(e) => setWhatsappUrl(e.target.value)}
            placeholder="https://wa.me/234XXXXXXXXXX"
            className="text-base h-10 mt-1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram" className="text-sm font-medium">
            Instagram Handle
          </Label>
          <Input
            id="instagram"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            placeholder="@yourhandle"
            className="text-base h-10 mt-1"
          />
        </div>

        <Button
          type="submit"
          className="w-full hover:brightness-110 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create My ShopLink"}
        </Button>
      </form>
    </main>
  );
}
