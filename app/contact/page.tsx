"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Send, Clock, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (error) {
        toast.error("Erreur lors de l'envoi. Veuillez reessayer.");
        console.error(error);
      } else {
        toast.success("Message envoye avec succes !");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      toast.error("Erreur de connexion. Veuillez reessayer.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="h-8 w-8 text-emerald-800" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Contactez-nous</h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Une question, une suggestion ou une demande particuliere ? Nous sommes la pour vous aider.
          Remplissez le formulaire ci-dessous et nous vous repondrons dans les plus brefs delais.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
        {/* Contact form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                placeholder="Le sujet de votre message"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Votre message..."
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
          </form>
        </div>

        {/* Contact info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 rounded-xl p-6 space-y-6">
            <h2 className="font-semibold text-slate-900">Informations de contact</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
                  <Mail className="h-4 w-4 text-emerald-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Email</p>
                  <p className="text-sm text-slate-600">contact@aaronbooks.fr</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
                  <Phone className="h-4 w-4 text-emerald-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Telephone</p>
                  <p className="text-sm text-slate-600">+33 1 23 45 67 89</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
                  <MapPin className="h-4 w-4 text-emerald-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Adresse</p>
                  <p className="text-sm text-slate-600">12 Rue des Libraires<br />75001 Paris, France</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
                  <Clock className="h-4 w-4 text-emerald-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Horaires</p>
                  <p className="text-sm text-slate-600">Lun - Ven: 9h - 18h<br />Sam: 10h - 16h</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-emerald-50 rounded-xl p-6">
            <h2 className="font-semibold text-emerald-900 mb-3">Questions frequentes</h2>
            <div className="space-y-3 text-sm">
              <p className="text-emerald-800">
                <strong className="text-emerald-900">Delai de livraison ?</strong><br />
                2-3 jours ouvrables en France metropolitaine.
              </p>
              <p className="text-emerald-800">
                <strong className="text-emerald-900">Retours possibles ?</strong><br />
                Oui, sous 14 jours avec l'emballage intact.
              </p>
              <p className="text-emerald-800">
                <strong className="text-emerald-900">Paiement securise ?</strong><br />
                Paiement par Stripe avec cryptage SSL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
