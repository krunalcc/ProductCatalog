import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';

import { Product } from '../_models/products';
import { AuthenticationService, ProductService } from '../_services';
import { AddproductComponent } from './addproduct/addproduct.component';
import { Loading } from 'src/app/_helpers/loader/Loading';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({ templateUrl: 'product.component.html', styles: ['add-product { font-weight: normal; }'] })
export class ProductComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    searchInput: string = "";
    searchTerm$ = new Subject<string>();
    constructor(
        private productService: ProductService,
        public dialog: MatDialog,
        private ToastrService: ToastrService
    ) {
        // this.productService.search(this.searchTerm$)
        //     .subscribe((results: any) => {
        //         this.products = results.results;
        //     });

        this.productService.search(this.searchTerm$)
            .subscribe((results: any) => {
                this.products = results;
            },
                error => {
                    this.ToastrService.info(error);
                });
    }


    ngOnInit() {
        this.loadAllProducts();
    }

    ngOnDestroy() {
        this.searchTerm$.unsubscribe();
    }

    deleteProduct(id: number) {
        Loading.show();
        this.productService.delete(id)
            .pipe(first())
            .subscribe(() => {
                Loading.hide();
                this.loadAllProducts()
            },
                error => {
                    this.ToastrService.info(error);
                    Loading.hide();
                });
    }

    private loadAllProducts() {
        Loading.show();
        this.productService.getAll()
            .pipe(first())
            .subscribe((products: any) => {
                Loading.hide();
                return this.products = JSON.parse(JSON.stringify(products));
            },
                error => {
                    this.ToastrService.info(error);
                    Loading.hide();
                });
    }

    addProduct() {
        let dialogRef = this.dialog.open(AddproductComponent, {
            width: '250px',
        });

        dialogRef.afterClosed().subscribe(result => {
            this.loadAllProducts();
        },
            error => {
                this.ToastrService.info(error);
            });
    }
}