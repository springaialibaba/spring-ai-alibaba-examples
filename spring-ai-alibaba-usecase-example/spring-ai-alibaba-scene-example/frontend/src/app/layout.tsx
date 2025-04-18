// app/layout.tsx
"use client"; // [!code focus]
import "@/styles/globals.css";
import React, {useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {useAtomValue} from "jotai";
import {readOnlyTheme} from "@/stores/theme.atom";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import alibaba from "../../public/alibaba.svg"

const RootLayout = ({children}: { children: React.ReactNode; }) => {
    const [queryClient] = useState(() => new QueryClient());

    const themeValue = useAtomValue(readOnlyTheme);

    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8"/>
            <link rel="icon" href={alibaba.src}/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Spring AI Alibaba Playground</title>
        </head>
        <body className={themeValue}>
        <AntdRegistry>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false}/>
                {children}
            </QueryClientProvider>
        </AntdRegistry>
        </body>
        </html>
    );

}

export default RootLayout
