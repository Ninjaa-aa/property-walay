"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  formatPhoneNumber,
  getTelLink,
  getWhatsAppLink,
} from "@/lib/utils/format-phone";
import { Phone, MessageCircle, Calendar, Loader2, User } from "lucide-react";

interface ContactAgentCardProps {
  agentName?: string | null;
  phoneNumber?: string | null;
  onScheduleMeeting?: () => void;
  onSendMessage?: () => void;
  scheduling?: boolean;
}

export function ContactAgentCard({
  agentName,
  phoneNumber,
  onScheduleMeeting,
  onSendMessage,
  scheduling = false,
}: ContactAgentCardProps) {
  const telLink = getTelLink(phoneNumber);
  const whatsappLink = getWhatsAppLink(phoneNumber);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Agent Name */}
        <div className="flex items-center gap-2">
          <User className="text-muted-foreground h-5 w-5" />
          <span className="font-medium">{agentName || "Property Agent"}</span>
        </div>

        {/* Phone Number */}
        {phoneNumber && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Phone</p>
            <p className="font-medium">{formatPhoneNumber(phoneNumber)}</p>
            <div className="flex gap-2">
              {telLink && (
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <a href={telLink}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </a>
                </Button>
              )}
              {whatsappLink && (
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button className="w-full" onClick={onScheduleMeeting} disabled={scheduling}>
            {scheduling ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Calendar className="mr-2 h-4 w-4" />
            )}
            Schedule Meeting
          </Button>
          <Button variant="outline" className="w-full" onClick={onSendMessage}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
