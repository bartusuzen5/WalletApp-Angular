import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"",
        loadComponent: () => import("./core/components/layout/layout.component").then(c => c.LayoutComponent),
        children: [
            {
                path: "category",
                loadComponent: () => import("./features/category/category.component").then(c => c.CategoryComponent)
            },
            {
                path: "currency",
                loadComponent: () => import("./features/currency/currency.component").then(c => c.CurrencyComponent)
            },
            {
                path: "asset/:category",
                loadComponent: () => import("./features/asset/asset.component").then(c => c.AssetComponent)
            },
            {
                path: "trade",
                loadComponent: () => import("./features/trade/trade.component").then(c => c.TradeComponent)
            },
            {
                path: "dividend",
                loadComponent: () => import("./features/dividend/dividend.component").then(c => c.DividendComponent)
            },
            {
                path: "",
                loadComponent: () => import("./features/wallet/wallet.component").then(c => c.WalletComponent),
            },
            {
                path: "wallet",
                loadComponent: () => import("./features/wallet/wallet.component").then(c => c.WalletComponent),
            },
            {
                path: "wallet-category/:category",
                loadComponent: () => import("./features/wallet/wallet-category/wallet-category.component").then(c => c.WalletCategoryComponent)
            }
        ]
    },
];
