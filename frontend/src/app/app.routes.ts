import { Routes } from '@angular/router';
import { TradeComponent } from './features/trade/trade.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    {
        path:"login",
        loadComponent: () => import("./core/components/user/login/login.component").then(c => c.LoginComponent)
    },
    {
        path:"register",
        loadComponent: () => import("./core/components/user/register/register.component").then(c => c.RegisterComponent)
    },
    {
        path:"",
        loadComponent: () => import("./core/components/layout/layout.component").then(c => c.LayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: "category",
                canActivate: [adminGuard],
                loadComponent: () => import("./features/category/category.component").then(c => c.CategoryComponent)
            },
            {
                path: "currency",
                canActivate: [adminGuard],
                loadComponent: () => import("./features/currency/currency.component").then(c => c.CurrencyComponent)
            },
            {
                path: "asset/:category",
                canActivate: [adminGuard],
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
                path: "wallet",
                loadComponent: () => import("./features/wallet/wallet.component").then(c => c.WalletComponent),
            },
            {
                path: "wallet-category/:category",
                loadComponent: () => import("./features/wallet/wallet-category/wallet-category.component").then(c => c.WalletCategoryComponent)
            }
        ]
    },
    {
        path:"**",
        redirectTo:"login"
    }
];
