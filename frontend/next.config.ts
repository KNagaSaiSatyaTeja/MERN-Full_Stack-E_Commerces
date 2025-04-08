import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[{
      protcol:'http',
      hostname:'192.168.1.5',
      port:'5000',
      pathname:'/uploads/**'
    },
    {
      protocol:'https',
      hostname:'localhost',
      port:'5000',
      pathname:'/uploads/**'}
    ]
  }
  
};

export default nextConfig;
