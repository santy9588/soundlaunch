import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Track } from "@/types/track";
import {
  BadgeCheck,
  CreditCard,
  DollarSign,
  Music,
  QrCode,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface EarnProps {
  tracks: Track[];
}

const ROYALTY_RATES = [
  { platform: "Spotify", perThousand: "$3.50", estimated: "Based on plays" },
  { platform: "Gaana", perThousand: "$1.20", estimated: "Based on plays" },
  { platform: "JioSaavn", perThousand: "$1.80", estimated: "Based on plays" },
  { platform: "Wynk Music", perThousand: "$1.50", estimated: "Based on plays" },
  {
    platform: "Hungama Music",
    perThousand: "$0.90",
    estimated: "Based on plays",
  },
  { platform: "Resso", perThousand: "$2.10", estimated: "Based on plays" },
  { platform: "Boomplay", perThousand: "$1.40", estimated: "Based on plays" },
];

interface PaymentGateway {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badge: string;
}

const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Indian payments — UPI, netbanking, wallets & cards",
    icon: <Zap className="w-4 h-4 text-blue-400" />,
    iconBg: "bg-blue-600/20",
    badge: "Available",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "International payments — 200+ countries supported",
    icon: <Wallet className="w-4 h-4 text-sky-400" />,
    iconBg: "bg-sky-600/20",
    badge: "Available",
  },
  {
    id: "paytm",
    name: "Paytm",
    description: "India's leading wallet — UPI & Paytm Pay",
    icon: <Smartphone className="w-4 h-4 text-indigo-400" />,
    iconBg: "bg-indigo-600/20",
    badge: "Available",
  },
  {
    id: "phonepe",
    name: "PhonePe",
    description: "Fast UPI transfers — India's top payment app",
    icon: <Smartphone className="w-4 h-4 text-purple-400" />,
    iconBg: "bg-purple-600/20",
    badge: "Available",
  },
  {
    id: "upi",
    name: "UPI",
    description: "QR code payments & UPI ID — instant bank transfers",
    icon: <QrCode className="w-4 h-4 text-green-400" />,
    iconBg: "bg-green-600/20",
    badge: "Available",
  },
  {
    id: "amazonpay",
    name: "Amazon Pay",
    description: "Amazon wallet — trusted by millions of Prime users",
    icon: <ShoppingBag className="w-4 h-4 text-orange-400" />,
    iconBg: "bg-orange-600/20",
    badge: "Available",
  },
];

export function Earn({ tracks }: EarnProps) {
  const totalEarnings = tracks.reduce((s, t) => s + t.earnings, 0);
  const sortedTracks = [...tracks].sort((a, b) => b.earnings - a.earnings);

  const handleRequestPayout = () => {
    toast.success(
      "Payout request submitted! We'll process it within 3-5 business days.",
      {
        duration: 5000,
      },
    );
  };

  const handleConnectGateway = (name: string) => {
    toast.info(
      `Connect your ${name} account in Admin settings to enable payouts.`,
      { duration: 4000 },
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold text-foreground font-display flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-400" />
          Earn
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate passive revenue from your music worldwide
        </p>
      </motion.div>

      {/* Total earnings card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
      >
        <Card className="bg-gradient-to-br from-emerald-900/30 to-background border-emerald-700/30">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                Total Earnings (All Tracks)
              </p>
              <p className="text-4xl font-bold text-emerald-400 font-display">
                ${totalEarnings.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">
                  Across {tracks.length} track{tracks.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <Button
              onClick={handleRequestPayout}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shrink-0"
              data-ocid="earn.payout.primary_button"
            >
              <DollarSign className="h-4 w-4" />
              Request Payout
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Royalty rates table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.14 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Platform Royalty Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table data-ocid="earn.royalty.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Per 1,000 Streams</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Estimated Monthly
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROYALTY_RATES.map((row) => (
                  <TableRow key={row.platform}>
                    <TableCell className="font-medium">
                      {row.platform}
                    </TableCell>
                    <TableCell className="text-emerald-400 font-semibold">
                      {row.perThousand}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {row.estimated}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Earnings by track */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              Earnings by Track
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {sortedTracks.length === 0 ? (
              <div
                className="py-10 text-center text-muted-foreground text-sm"
                data-ocid="earn.tracks.empty_state"
              >
                No tracks uploaded yet. Upload your first track to start
                earning.
              </div>
            ) : (
              <Table data-ocid="earn.tracks.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Track</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Artist
                    </TableHead>
                    <TableHead>Plays</TableHead>
                    <TableHead>Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTracks.map((track, i) => (
                    <TableRow
                      key={track.id}
                      data-ocid={`earn.tracks.item.${i + 1}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                            {track.coverUrl ? (
                              <img
                                src={track.coverUrl}
                                alt={track.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
                                <Music className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium truncate max-w-[120px] sm:max-w-none">
                            {track.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden sm:table-cell">
                        {track.artist}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {track.plays.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-emerald-400 font-semibold">
                        ${track.earnings.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment methods */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.26 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Connected Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stripe — configured */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-emerald-600/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-600/20 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Stripe
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Credit &amp; debit cards
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30 gap-1">
                <BadgeCheck className="w-3 h-3" />
                Configured
              </Badge>
            </div>

            {/* Available gateways section */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Available Payment Providers
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_GATEWAYS.map((gw, i) => (
                  <motion.div
                    key={gw.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: 0.3 + i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border hover:border-primary/30 hover:bg-muted/30 transition-all"
                    data-ocid={`earn.gateway.card.${i + 1}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${gw.iconBg}`}
                      >
                        {gw.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {gw.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                          {gw.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 text-xs border-primary/40 text-primary hover:bg-primary/10 hover:border-primary shrink-0 font-medium"
                      onClick={() => handleConnectGateway(gw.name)}
                      data-ocid={`earn.gateway.button.${i + 1}`}
                    >
                      Connect
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
