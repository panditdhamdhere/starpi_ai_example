"use client";

import React, { FormEvent, useState } from "react";

import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel } from "./ui/field";

import { Input } from "./ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const AuthForm = ({ mode }: { mode: "login" | "register" }) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const isRegister = mode === "register";

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsPending(true);
        const formData = new FormData(event.currentTarget);
        const payload = isRegister
            ? {
                username: formData.get("username"),
                email: formData.get("email"),
                password: formData.get("password"),
            }
            : {
                identifier: formData.get("identifier"),
                password: formData.get("password"),
            };

        const response = await fetch(`/api/auth/${mode}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
            setError(
                typeof data?.error === "string"
                    ? data.error
                    : "Something went wrong. Check your credentials and try again."
            );
            setIsPending(false);
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    return (
        <form onSubmit={onSubmit}>
            <FieldGroup>
                {isRegister ? (
                    <Field>
                        <FieldLabel htmlFor="username">UserName</FieldLabel>
                        <Input
                            id="username"
                            name="username"
                            autoComplete="username"
                            required
                        />
                    </Field>
                ) : null}

                <Field>
                    <FieldLabel htmlFor={isRegister ? "email" : "identifier"}>
                        {isRegister ? "Email" : "Email or Username"}
                    </FieldLabel>

                    <Input
                        id={isRegister ? "email" : "identifier"}
                        name={isRegister ? "email" : "identifier"}
                        type={isRegister ? "email" : "text"}
                        autoComplete={isRegister ? "email" : "username"}
                        required
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input

                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isRegister ? "new-password" : "current-password"}
                        required
                    />
                </Field>

                {
                    error ? (
                        <Alert variant="destructive" >
                            <AlertDescription >{error} </AlertDescription>
                        </Alert>
                    ) : null}

                <Button type="submit" size="lg" disabled={isPending} >
                    {
                        isPending ? isRegister ? "Creating Account..." : "Signing In..."
                            : isRegister ? "Create Account" : "Sign In"
                    }
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                    {
                        isRegister ? "Already have an account" : "No Account yet ? "
                    } {""}
                    <Link
                        href={isRegister ? "/login" : "/register"}
                        className="font-medium text-foreground underline underline-offset-4"
                    >
                        {isRegister ? "Sign In " : "Create One"}
                    </Link>
                </p>

            </FieldGroup>
        </form>
    );
};
