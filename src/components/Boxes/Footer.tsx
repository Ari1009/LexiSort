import {
    Background,
    Column,
    IconButton,
    Line,
    Logo,
    Row,
    SmartLink,
    Text,
    ThemeSwitcher,
} from "@/once-ui/components";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <Row as="footer" fillWidth horizontal="center" paddingTop="80" position="relative">
            {/* Visual background effect */}
            <Background
                position="absolute"
                top="0"
                left="0"
                right="0"
                mask={{
                    x: 50,
                    y: 20,
                    radius: 70,
                }}
                grid={{
                    display: true,
                    width: "0.5rem",
                    color: "neutral-alpha-weak",
                    height: "0.5rem",
                    opacity: 40,
                }}
                gradient={{
                    display: true,
                    tilt: -10,
                    height: 40,
                    width: 100,
                    x: 50,
                    y: 10,
                    opacity: 20,
                    colorStart: "brand-background-weak",
                    colorEnd: "page-background",
                }}
            />

            <Column
                maxWidth="l"
                fillWidth
                paddingX="32"
                paddingBottom="40"
                gap="48"
                borderTop="neutral-alpha-weak"
                position="relative"
            >
                {/* Main footer content */}
                <Row
                    fillWidth
                    horizontal="space-between"
                    paddingTop="40"
                    mobileDirection="column"
                    gap="40"
                >
                    {/* Brand section */}
                    <Column gap="16">
                        <Logo size="s" icon={true} href="/" aria-label="lexisort Homepage" />
                        <Text variant="body-default-s" onBackground="neutral-medium">
                            Secure, private, AI-powered email companion
                        </Text>
                        <Row gap="12" paddingTop="16">
                            <IconButton
                                variant="tertiary"
                                size="s"
                                icon="instagram"
                                href="https://www.instagram.com/arihant09/"
                                aria-label="Instagram"
                            />
                            <IconButton
                                variant="tertiary"
                                size="s"
                                icon="linkedin"
                                href="https://www.linkedin.com/in/arihant-pal-2b8714228/"
                                aria-label="LinkedIn"
                            />
                            <IconButton
                                variant="tertiary"
                                size="s"
                                icon="github"
                                href="https://github.com/Ari1009/Lexisort"
                                aria-label="GitHub"
                            />
                        </Row>
                    </Column>

                    {/* Links section */}
                    <Row gap="64" mobileDirection="column" horizontal="end">
                        <Column gap="16">
                            <Text variant="label-strong-s">Product</Text>
                            <Column gap="12">
                                <SmartLink href="/features">Features</SmartLink>
                            </Column>
                        </Column>

                        <Column gap="16">
                            <Text variant="label-strong-s">Company</Text>
                            <Column gap="12">
                                <SmartLink href="/features">About</SmartLink>
                            </Column>
                        </Column>
                    </Row>
                </Row>

                <Line background="neutral-alpha-weak" />

                {/* Bottom section with copyright and social links */}
                <Row
                    fillWidth
                    horizontal="space-between"
                    mobileDirection="column-reverse"
                    gap="24"
                    vertical="center"
                >
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                        © {currentYear} lexisort. All rights reserved.
                    </Text>

                    <Row gap="16" vertical="center">
                        <ThemeSwitcher />
                    </Row>
                </Row>
            </Column>
        </Row>
    );
}
