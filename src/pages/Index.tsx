import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Phone, Heart, Users, ArrowRight, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }
  })
};

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-heading font-bold text-lg text-foreground">AfyaConnect</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
        <a href="#plans" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Plans</a>
        <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login">
          <Button variant="ghost" size="sm">Log In</Button>
        </Link>
        <Link to="/register">
          <Button size="sm" className="bg-gradient-hero hover:opacity-90 text-primary-foreground">Get Covered</Button>
        </Link>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-hero opacity-[0.03]" />
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="visible" className="space-y-6">
          <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Heart className="w-3.5 h-3.5" />
            Health Insurance for Every Kenyan
          </motion.div>
          <motion.h1 custom={1} variants={fadeUp} className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
            Affordable Health Coverage via{" "}
            <span className="text-primary">M-Pesa</span>
          </motion.h1>
          <motion.p custom={2} variants={fadeUp} className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Designed for jua kali workers, bodaboda riders, mama mbogas, and all informal sector workers. Pay as little as KES 50/day. No paperwork.
          </motion.p>
          <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90 text-primary-foreground gap-2 text-base px-8">
                Enroll Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2 text-base">
              <Phone className="w-4 h-4" /> Dial *384#
            </Button>
          </motion.div>
          <motion.div custom={4} variants={fadeUp} className="flex items-center gap-6 pt-2">
            {["No hidden fees", "Instant M-Pesa", "Family coverage"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle className="w-3.5 h-3.5 text-success" /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-elevated">
            <img src={heroImage} alt="Happy Kenyan workers with health insurance" className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-elevated border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-heading font-bold text-foreground">120K+</p>
                <p className="text-xs text-muted-foreground">Members covered</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -top-4 -right-4 bg-card rounded-xl p-3 shadow-elevated border border-border"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">4.8 Rating</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

const features = [
  { icon: Phone, title: "M-Pesa Payments", desc: "Pay premiums directly from your phone. STK push, paybill, or USSD—whatever works for you." },
  { icon: Shield, title: "AI Fraud Detection", desc: "Smart systems protect your contributions and ensure fair claims processing for everyone." },
  { icon: Heart, title: "Comprehensive Cover", desc: "Outpatient, inpatient, dental, and maternity care at 2,000+ partner hospitals across Kenya." },
  { icon: Users, title: "Family Plans", desc: "Cover your spouse and up to 4 children. Group rates for chamas and SACCOs." },
];

const Features = () => (
  <section id="features" className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
        <motion.h2 custom={0} variants={fadeUp} className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
          Why AfyaConnect?
        </motion.h2>
        <motion.p custom={1} variants={fadeUp} className="mt-3 text-muted-foreground max-w-md mx-auto">
          Built from the ground up for Kenya's informal sector.
        </motion.p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-elevated transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gradient-hero group-hover:text-primary-foreground transition-all">
              <f.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const plans = [
  { name: "Msingi", price: "50", period: "/day", badge: "Most Popular", features: ["Outpatient cover up to KES 50,000", "Inpatient cover up to KES 200,000", "M-Pesa daily/weekly/monthly", "2,000+ partner hospitals"], highlight: true },
  { name: "Familia", price: "1,500", period: "/month", badge: "Best Value", features: ["Everything in Msingi", "Spouse + 4 children", "Dental & optical cover", "Maternity benefit KES 100,000"], highlight: false },
  { name: "Chama", price: "1,000", period: "/member/mo", badge: "Groups", features: ["Everything in Familia", "Group discount 20%", "Dedicated chama manager", "Bulk M-Pesa collection"], highlight: false },
];

const Plans = () => (
  <section id="plans" className="py-20">
    <div className="container mx-auto px-4">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
        <motion.h2 custom={0} variants={fadeUp} className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
          Simple, Transparent Pricing
        </motion.h2>
        <motion.p custom={1} variants={fadeUp} className="mt-3 text-muted-foreground max-w-md mx-auto">
          No hidden charges. Pay with M-Pesa. Cancel anytime.
        </motion.p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className={`rounded-2xl p-6 border ${p.highlight ? "bg-gradient-hero text-primary-foreground border-primary shadow-elevated scale-105" : "bg-card border-border shadow-card"}`}
          >
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${p.highlight ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"}`}>
              {p.badge}
            </span>
            <h3 className="font-heading text-xl font-bold">{p.name}</h3>
            <div className="mt-2 mb-6">
              <span className="text-3xl font-extrabold font-heading">KES {p.price}</span>
              <span className={`text-sm ${p.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{p.period}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${p.highlight ? "text-primary-foreground/80" : "text-success"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/register">
              <Button className={`w-full ${p.highlight ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : "bg-gradient-hero text-primary-foreground hover:opacity-90"}`}>
                Choose {p.name}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const steps = [
  { step: "1", title: "Dial *384# or Download App", desc: "Register in under 2 minutes with your ID number and phone." },
  { step: "2", title: "Choose Your Plan", desc: "Pick what works for you—daily, weekly, or monthly payments." },
  { step: "3", title: "Pay via M-Pesa", desc: "Get an instant STK push. Your cover starts immediately." },
  { step: "4", title: "Visit Any Partner Hospital", desc: "Show your digital card and get treated. No cash needed." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
        <motion.h2 custom={0} variants={fadeUp} className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
          Get Covered in 4 Steps
        </motion.h2>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <motion.div key={s.step} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center text-xl font-bold font-heading mx-auto mb-4">
              {s.step}
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gradient-hero text-primary-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6" />
            <span className="font-heading font-bold text-lg">AfyaConnect</span>
          </div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            Making quality healthcare accessible to every Kenyan worker, one M-Pesa payment at a time.
          </p>
        </div>
        {[
          { title: "Product", links: ["Plans", "Features", "Claims", "Partners"] },
          { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
          { title: "Support", links: ["Help Center", "Terms", "Privacy", "Complaints"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-heading font-semibold mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
        © 2026 AfyaConnect. Regulated by Insurance Regulatory Authority (IRA) Kenya.
      </div>
    </div>
  </footer>
);

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <Features />
    <Plans />
    <HowItWorks />
    <Footer />
  </div>
);

export default Index;
