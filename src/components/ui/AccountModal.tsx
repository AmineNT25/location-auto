"use client";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Modal from "./Modal";
export default function AccountModal({ onClose }: { onClose: () => void }) {
  const [signUp, setSignUp] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <Modal
      title={
        done
          ? "Thanks for stopping by"
          : signUp
            ? "Start your next chapter"
            : "Welcome to DriveGo"
      }
      onClose={onClose}
    >
      {done ? (
        <div className="p-7 text-center">
          <Check className="mx-auto size-10 text-emerald-600" />
          <h3 className="mt-4 text-xl font-semibold">
            You&apos;re in the driver&apos;s seat.
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            This demo does not create accounts or sign you in. Your favorite
            cars are saved on this browser, and you can explore and book a demo
            ride without an account.
          </p>
          <button
            className="mt-6 rounded-md bg-brand px-6 py-3 text-sm text-white"
            onClick={onClose}
          >
            Explore the collection
          </button>
        </div>
      ) : (
        <form
          className="space-y-5 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <p className="text-sm leading-6 text-muted">
            Your next adventure starts with a great ride.
          </p>
          {signUp && (
            <label className="block text-sm font-medium">
              Name
              <input
                required
                autoComplete="name"
                className="mt-2 w-full rounded-md border border-gray-200 p-3 font-normal"
                placeholder="Your name"
              />
            </label>
          )}
          <label className="block text-sm font-medium">
            Email address
            <input
              required
              type="email"
              autoComplete="email"
              className="mt-2 w-full rounded-md border border-gray-200 p-3 font-normal"
              placeholder="you@example.com"
            />
          </label>
          <p className="rounded-md bg-paper p-3 text-xs leading-5 text-muted">
            Account preview only. No account is created and your email is not
            sent or stored.
          </p>
          <button className="flex w-full items-center justify-center gap-3 rounded-md bg-brand py-3.5 text-sm font-semibold text-white">
            {signUp ? "Preview sign up" : "Preview login"}
            <ArrowRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setSignUp(!signUp)}
            className="w-full text-center text-xs text-brand"
          >
            {signUp
              ? "Already have an account? Log in"
              : "New to DriveGo? Sign up"}
          </button>
        </form>
      )}
    </Modal>
  );
}
