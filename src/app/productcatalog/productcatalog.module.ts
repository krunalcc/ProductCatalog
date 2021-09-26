import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCatalogRoutingModule } from './product-catalog-routing.module';
import { ProductlistComponent } from './productlist/productlist.component';
import { AddproductComponent } from './addproduct/addproduct.component';

@NgModule({
    imports: [
        CommonModule,
        ProductCatalogRoutingModule
    ],
    declarations: [ProductlistComponent, AddproductComponent]
})
export class ProductcatalogModule { }