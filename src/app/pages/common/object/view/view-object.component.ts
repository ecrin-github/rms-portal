import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Component({
    selector: 'app-view-object',
    templateUrl: './view-object.component.html'
})
export class ViewObjectComponent implements OnInit {

    private url = 'https://github.uio.no/elixir/sso';

    private elixirInfo = {
        name: 'Sergei Gorianin',
        email: 'frequenteen@gmail.com'
    };

    private data = {
        elixir_token: 'token',
        elixir_info: this.elixirInfo,
        dataset_id: null
    };

    constructor(
        private http: HttpClient
    ) {
    }

    attachDataset(datasetId: string){
        this.data.dataset_id = datasetId;
        this.http.post(this.url, this.data);
    }

    ngOnInit(): void {
    }

}
