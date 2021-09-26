import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product } from '../_models/products';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor(private http: HttpClient) { }
    getAll() {
        return this.http.get<Product[]>(`${'http://localhost:4000'}/products`);
    }

    add(product: Product) {
        return this.http.post(`${'http://localhost:4000'}/products/add`, product);
    }

    delete(id: number) {
        return this.http.delete(`${'http://localhost:4000'}/products/${id}`);
    }
    // search(terms: Observable<string>) {
    //     // return terms.pipe(debounceTime(800),
    //     //     distinctUntilChanged()
    //     // )
    //     //     .subscribe(term => {
    //     //         this.searchEntries(term)
    //     //     })
    // }

    // searchEntries(term: any) {
    //     return this.http
    //         .get(`${'http://localhost:4000'}/products/get` + term)
    //         .pipe(map((res: any) => res.json()));
    // }

    search(terms: Observable<string>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => this.searchEntries(term)));
    }

    searchEntries(term: string) {
        return this.http
            .get(`${'http://localhost:4000'}/products/` + term);
    }
}