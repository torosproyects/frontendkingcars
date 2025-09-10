"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { VerificationWizard } from '@/components/verification/VerificationWizard';

function VerificationContent() {
  return <VerificationWizard />;
}

export default function ProfileVerificationPage() {
  return (
    <ProtectedRoute requiredRoles={[]}>
      <VerificationContent />
    </ProtectedRoute>
  );
}
