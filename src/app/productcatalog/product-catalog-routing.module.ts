import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductlistComponent } from './productlist/productlist.component';
import { AddproductComponent } from './addproduct/addproduct.component';

const routes: Routes = [
    {
        path: "",
        component: ProductlistComponent,
        children: [
            { path: "", redirectTo: "/products", pathMatch: "full" },
            { path: "products", component: ProductlistComponent }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductCatalogRoutingModule { }