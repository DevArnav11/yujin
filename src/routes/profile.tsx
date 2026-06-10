import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, MapPin, Package, Sparkles, Heart, Save, Award } from "lucide-react";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Yujin" },
      { name: "description", content: "Manage your Yujin profile, track orders and reward points." },
    ],
  }),
  component: ProfilePage,
});

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const EMPTY: ProfileData = {
  name: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

const STORAGE_KEY = "yujin.profile.v1";

function ProfilePage() {
  const [data, setData] = useState<ProfileData>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  const initial = (data.name || "Y").trim().charAt(0).toUpperCase();

  const update = (k: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      toast.success("Profile saved", { description: "Your details are stored on this device." });
    } catch {
      toast.error("Couldn't save profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      {/* Hero strip */}
      <section className="bg-[color:var(--cream-deep)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-display text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.65_0.16_50/0.55)]">
              {initial}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Your space</p>
              <h1 className="font-display text-3xl text-foreground md:text-4xl">
                {data.name ? `Hi, ${data.name.split(" ")[0]}` : "Welcome to Yujin"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Cozy details, kept just for you.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <Stat icon={Award} label="Points" value="240" />
            <Stat icon={Package} label="Orders" value="0" />
            <Stat icon={Heart} label="Saved" value="0" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-8 grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <form onSubmit={save} className="grid gap-8 md:grid-cols-2">
              {/* Personal */}
              <div className="rounded-3xl border border-border/60 bg-[color:var(--cream-deep)] p-7">
                <div className="mb-5 flex items-center gap-2 text-primary">
                  <User className="h-4 w-4" />
                  <h2 className="font-display text-xl text-foreground">Personal</h2>
                </div>
                <div className="space-y-4">
                  <Field label="Full name" id="name">
                    <Input id="name" value={data.name} onChange={update("name")} placeholder="Your name" />
                  </Field>
                  <Field label="Email" id="email">
                    <Input id="email" type="email" value={data.email} onChange={update("email")} placeholder="you@example.com" />
                  </Field>
                  <Field label="Phone" id="phone">
                    <Input id="phone" value={data.phone} onChange={update("phone")} placeholder="Optional" />
                  </Field>
                </div>
              </div>

              {/* Address */}
              <div className="rounded-3xl border border-border/60 bg-[color:var(--cream-deep)] p-7">
                <div className="mb-5 flex items-center gap-2 text-primary">
                  <MapPin className="h-4 w-4" />
                  <h2 className="font-display text-xl text-foreground">Shipping address</h2>
                </div>
                <div className="space-y-4">
                  <Field label="Address line 1" id="addr1">
                    <Input id="addr1" value={data.addressLine1} onChange={update("addressLine1")} placeholder="Street, building" />
                  </Field>
                  <Field label="Address line 2" id="addr2">
                    <Input id="addr2" value={data.addressLine2} onChange={update("addressLine2")} placeholder="Apt, floor (optional)" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="City" id="city">
                      <Input id="city" value={data.city} onChange={update("city")} />
                    </Field>
                    <Field label="State" id="state">
                      <Input id="state" value={data.state} onChange={update("state")} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="ZIP / Postal" id="zip">
                      <Input id="zip" value={data.zip} onChange={update("zip")} />
                    </Field>
                    <Field label="Country" id="country">
                      <Input id="country" value={data.country} onChange={update("country")} />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-3">
                <p className="text-xs text-muted-foreground">
                  {loaded ? "Saved locally on this device." : "Loading…"}
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.65_0.16_50/0.55)] transition-all hover:-translate-y-0.5"
                >
                  <Save className="h-4 w-4" /> Save profile
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="orders">
            <EmptyState
              icon={Package}
              title="No orders yet"
              body="When you place your first order, it'll show up here with live tracking."
            />
          </TabsContent>

          <TabsContent value="rewards">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 rounded-3xl bg-primary p-8 text-primary-foreground">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] opacity-80">
                  <Sparkles className="h-3.5 w-3.5" /> Yujin Club
                </div>
                <p className="mt-4 font-display text-5xl">240 pts</p>
                <p className="mt-2 max-w-sm text-sm opacity-90">
                  Earn 10 pts for every $1 spent. 500 pts unlocks a free cozy tote with your next drop.
                </p>
                <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-primary-foreground/20">
                  <div className="h-full w-[48%] rounded-full bg-primary-foreground/90" />
                </div>
                <p className="mt-2 text-xs opacity-80">260 pts to your next reward</p>
              </div>
              <div className="rounded-3xl border border-border/60 bg-[color:var(--cream-deep)] p-7">
                <h3 className="font-display text-lg">Perks</h3>
                <ul className="mt-4 space-y-3 text-sm text-foreground/80">
                  <li>· Early access to drops</li>
                  <li>· Free shipping over $80</li>
                  <li>· Birthday surprise</li>
                  <li>· Members-only colorways</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs uppercase tracking-wide text-foreground/70">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background px-4 py-3 text-center shadow-sm">
      <Icon className="mx-auto h-4 w-4 text-primary" strokeWidth={1.8} />
      <p className="mt-1 font-display text-xl">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, body }: { icon: typeof Package; title: string; body: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-border bg-[color:var(--cream-deep)] p-12 text-center">
      <Icon className="mx-auto h-10 w-10 text-primary/70" strokeWidth={1.6} />
      <h2 className="mt-4 font-display text-2xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
