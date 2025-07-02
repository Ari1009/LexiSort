"use client";

import Footer from "@/components/Boxes/Footer";
import TopNav from "@/components/Boxes/TopNav";
import {
    Background,
    Badge,
    Button,
    Column,
    Fade,
    Grid,
    Heading,
    Icon,
    Input,
    Line,
    Row,
    SmartImage,
    Text,
    Card,
} from "@/once-ui/components";
import type React from "react";
import { useEffect, useState } from "react";

export default function Home() {
    const [wishlistEmail, setWishlistEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [userCount, setUserCount] = useState(0);
    const [alreadySubscribed, setAlreadySubscribed] = useState(false);

    const features = [
        {
            title: "Smart Inbox Organization",
            img: "/images/landing/inbox.png",
            description: "AI-powered inbox that automatically categorizes and prioritizes your emails, making it easy to focus on what matters most.",
            details: [
                "Automatic email categorization by type and importance",
                "Smart filtering to reduce inbox clutter",
                "Intelligent sorting based on sender and content",
                "Customizable organization rules"
            ],
            icon: "inbox",
            color: "brand",
        },
        {
            title: "AI-Powered Smart Reply",
            img: "/images/landing/smart_reply.png",
            description: "Generate contextually appropriate email replies with just one click. Our AI understands the tone and content of the original email.",
            details: [
                "One-click smart reply generation",
                "Tone-matching responses",
                "Context-aware suggestions",
                "Professional formatting with proper etiquette"
            ],
            icon: "sparkles",
            color: "accent",
        },
        {
            title: "Priority & Folder Filtering",
            img: "/images/landing/priority_filter.png",
            description: "Advanced filtering system that helps you organize emails by priority levels and custom folders for better workflow management.",
            details: [
                "Priority-based email filtering (Urgent, High, Medium, Low)",
                "Custom folder creation and management",
                "Smart categorization by email type",
                "Quick access to important communications"
            ],
            icon: "flag",
            color: "warning",
        },
        {
            title: "Intelligent Folder Management",
            img: "/images/landing/folder_filter.png",
            description: "Organize your emails into intelligent folders that adapt to your workflow and communication patterns.",
            details: [
                "AI-suggested folder organization",
                "Automatic email routing",
                "Custom folder hierarchies",
                "Smart tagging and labeling"
            ],
            icon: "folder",
            color: "info",
        },
        {
            title: "Calendar Integration",
            img: "/images/landing/calendar.png",
            description: "Seamlessly integrate your email with calendar events, making scheduling and meeting management effortless.",
            details: [
                "Email-to-calendar event creation",
                "Meeting scheduling from emails",
                "Calendar event reminders",
                "Integrated time management"
            ],
            icon: "calendar",
            color: "success",
        },
        {
            title: "Event Management",
            img: "/images/landing/calendar_event.png",
            description: "Transform email conversations into calendar events with intelligent date and time extraction.",
            details: [
                "Automatic date/time detection from emails",
                "One-click event creation",
                "Meeting participant management",
                "Event reminder integration"
            ],
            icon: "clock",
            color: "brand",
        },
        {
            title: "User Customization",
            img: "/images/landing/user_custom.png",
            description: "Personalize your email experience with custom settings, themes, and preferences that adapt to your workflow.",
            details: [
                "Customizable interface themes",
                "Personalized email templates",
                "Adaptive learning preferences",
                "User-specific AI training"
            ],
            icon: "settings",
            color: "accent",
        },
        {
            title: "AI Preferences & Insights",
            img: "/images/landing/ai_prefrence.png",
            description: "Get intelligent insights about your email patterns and customize AI behavior to match your communication style.",
            details: [
                "Email pattern analysis",
                "AI behavior customization",
                "Communication style insights",
                "Productivity recommendations"
            ],
            icon: "brain",
            color: "warning",
        },
        {
            title: "Analytics & Insights",
            img: "/images/landing/insight.png",
            description: "Gain valuable insights into your email habits and productivity patterns with detailed analytics.",
            details: [
                "Email response time analytics",
                "Communication pattern insights",
                "Productivity metrics",
                "Performance optimization suggestions"
            ],
            icon: "chart",
            color: "info",
        },
    ];

    const targetAudience = [
        {
            title: "Busy Professionals",
            description: "Focus on high-priority communications without drowning in your inbox. Smart categorization and priority filtering help you stay on top of important emails.",
            icon: "briefcase",
        },
        {
            title: "Team Leaders",
            description: "Efficiently manage work communications with smart filters, calendar integration, and AI-powered organization that scales with your team.",
            icon: "group",
        },
        {
            title: "Privacy-Conscious Users",
            description: "Keep your email data secure with our privacy-first approach and end-to-end encryption. Your data stays private and protected.",
            icon: "shield",
        },
        {
            title: "Gmail Power Users",
            description: "Take your Gmail experience to the next level with AI-powered organization, smart replies, and intelligent insights.",
            icon: "sparkles",
        },
    ];

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await fetch("/api/wishlist");
                const data = await response.json();

                if (data.success && data.data?.count) {
                    animateCounter(data.data.count);
                } else {
                    animateCounter(1247);
                }
            } catch (error) {
                animateCounter(1247);
            }
        };

        fetchUserCount();
    }, []);

    const animateCounter = (targetCount: number) => {
        const duration = 1500;
        const step = 30;
        const increment = Math.ceil(targetCount / (duration / step));
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetCount) {
                setUserCount(targetCount);
                clearInterval(timer);
            } else {
                setUserCount(current);
            }
        }, step);
    };

    const handleWishlistSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wishlistEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wishlistEmail)) {
            setSubmitError("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const response = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: wishlistEmail }),
            });

            const data = await response.json();

            if (data.success) {
                const isAlreadySubscribed = data.message?.includes("already");
                setAlreadySubscribed(isAlreadySubscribed);

                if (!isAlreadySubscribed) {
                    setUserCount((prev) => prev + 1);
                }

                setSubmitted(true);
                setWishlistEmail("");
            } else {
                setSubmitError(data.error || "Failed to join wishlist. Please try again.");
            }
        } catch (error) {
            setSubmitError("An unexpected error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Column fillWidth paddingTop="40" paddingBottom="48" horizontal="center" flex={1}>
            <Fade
                zIndex={3}
                pattern={{ display: true, size: "4" }}
                position="fixed"
                top="0"
                left="0"
                to="bottom"
                height={5}
                fillWidth
                blur={0.25}
            />

            <TopNav />

            <Column overflow="hidden" as="main" position="relative" horizontal="center" fillWidth>
                {/* Hero Section */}
                <Column
                    fillWidth
                    horizontal="center"
                    paddingX="l"
                    paddingY="xl"
                    gap="xl"
                    data-brand="emerald"
                >
                    <Column maxWidth="s" horizontal="center" gap="l">
                        <Row
                            radius="full"
                            minWidth="56"
                            minHeight="4"
                            solid="brand-medium"
                            data-solid="inverse"
                        />
                        <Heading as="h2" align="center" variant="display-strong-l">
                            Your AI-Powered Email Companion
                        </Heading>
                        <Text
                            align="center"
                            onBackground="neutral-medium"
                            variant="body-default-l"
                        >
                            Transform your email experience with intelligent organization, smart replies, and seamless calendar integration. 
                            Focus on what matters while AI handles the rest.
                        </Text>
                        <Row gap="8" horizontal="center">
                            <Button
                                href="/register"
                                prefixIcon="sparkles"
                                size="l"
                                label="Get Started Free"
                                variant="primary"
                            />
                            <Button
                                href="/features"
                                size="l"
                                label="Learn More"
                                variant="secondary"
                            />
                        </Row>
                    </Column>
                </Column>

                {/* Features Grid */}
                <Column
                    fillWidth
                    horizontal="center"
                    paddingX="l"
                    paddingY="xl"
                    gap="xl"
                >
                    <Column maxWidth="m" horizontal="center" gap="l">
                        <Heading as="h3" align="center" variant="display-strong-m">
                            Powerful Features
                        </Heading>
                        <Text
                            align="center"
                            onBackground="neutral-medium"
                            variant="body-default-l"
                        >
                            Everything you need to master your inbox with AI-powered intelligence
                        </Text>
                    </Column>

                    <Grid columns={3} gap="xl" maxWidth="xl" fillWidth>
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                padding="l"
                                radius="l"
                                border="neutral-alpha-medium"
                                background="surface"
                                style={{
                                    transition: "all 0.3s ease",
                                    cursor: "pointer",
                                }}
                                className="hover:shadow-lg hover:scale-105"
                            >
                                <Column gap="l" fillWidth>
                                    {/* Image Section */}
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                            height: "200px",
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                            background: "var(--static-color-neutral-900)",
                                        }}
                                    >
                                        <SmartImage
                                            src={feature.img}
                                            alt={feature.title}
                                            fill
                                            style={{
                                                objectFit: "cover",
                                                objectPosition: "center",
                                            }}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "12px",
                                                right: "12px",
                                                background: "rgba(0, 0, 0, 0.7)",
                                                borderRadius: "8px",
                                                padding: "8px",
                                            }}
                                        >
                                            <Icon
                                                name={feature.icon}
                                                size="s"
                                                onBackground="neutral-strong"
                                            />
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <Column gap="m" fillWidth>
                                        <Heading variant="heading-strong-s">
                                            {feature.title}
                                        </Heading>
                                        <Text
                                            variant="body-default-s"
                                            onBackground="neutral-medium"
                                        >
                                            {feature.description}
                                        </Text>

                                        {/* Feature Details */}
                                        <Column gap="s">
                                            {feature.details.map((detail, detailIndex) => (
                                                <Row key={detailIndex} gap="s" vertical="center">
                                                    <Icon
                                                        name="checkCircle"
                                                        size="xs"
                                                        onBackground="success-medium"
                                                    />
                                                    <Text variant="body-default-xs">
                                                        {detail}
                                                    </Text>
                                                </Row>
                                            ))}
                                        </Column>
                                    </Column>
                                </Column>
                            </Card>
                        ))}
                    </Grid>
                </Column>

                {/* Target Audience Section */}
                <Column
                    fillWidth
                    horizontal="center"
                    paddingX="l"
                    paddingY="xl"
                    gap="xl"
                    background="neutral-alpha-weak"
                >
                    <Column maxWidth="m" horizontal="center" gap="l">
                        <Heading as="h3" align="center" variant="display-strong-m">
                            Perfect For Everyone
                        </Heading>
                        <Text
                            align="center"
                            onBackground="neutral-medium"
                            variant="body-default-l"
                        >
                            Whether you're a busy professional or a privacy-conscious user, 
                            lexisort adapts to your needs
                        </Text>
                    </Column>

                    <Grid columns={2} gap="l" maxWidth="l" fillWidth>
                        {targetAudience.map((audience, index) => (
                            <Card
                                key={index}
                                padding="l"
                                radius="l"
                                border="neutral-alpha-medium"
                                background="surface"
                                style={{
                                    transition: "all 0.3s ease",
                                }}
                                className="hover:shadow-lg"
                            >
                                <Row gap="l" vertical="center">
                                    <div
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "12px",
                                            background: "var(--static-color-brand-alpha-weak)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Icon
                                            name={audience.icon}
                                            size="m"
                                            onBackground="brand-medium"
                                        />
                                    </div>
                                    <Column gap="s" fillWidth>
                                        <Heading variant="heading-strong-s">
                                            {audience.title}
                                        </Heading>
                                        <Text
                                            variant="body-default-s"
                                            onBackground="neutral-medium"
                                        >
                                            {audience.description}
                                        </Text>
                                    </Column>
                                </Row>
                            </Card>
                        ))}
                    </Grid>
                </Column>

                {/* CTA Section */}
                <Column
                    fillWidth
                    horizontal="center"
                    paddingX="l"
                    paddingY="xl"
                    gap="xl"
                >
                    <Column maxWidth="m" horizontal="center" gap="l">
                        <Heading as="h3" align="center" variant="display-strong-m">
                            Ready to Transform Your Email?
                        </Heading>
                        <Text
                            align="center"
                            onBackground="neutral-medium"
                            variant="body-default-l"
                        >
                            Join thousands of users who are already experiencing the future of email management
                        </Text>
                        <Row gap="8" horizontal="center">
                            <Button
                                href="/register"
                                prefixIcon="sparkles"
                                size="l"
                                label="Start Free Today"
                                variant="primary"
                            />
                            <Button
                                href="/login"
                                size="l"
                                label="Sign In"
                                variant="secondary"
                            />
                        </Row>
                    </Column>
                </Column>
            </Column>

            <Footer />
        </Column>
    );
}
