import React, { Component } from "react";
import { Modal, Form } from "semantic-ui-react";

export default class Formsale extends Component {
    constructor(props) {
        super(props);

        this.state = {
            custList: [],
            proList: [],
            StoreList: [],
            Info: {
             
                CustomerId: "",
                ProductId: "",
                StoreId: "",
                DateSold: this.props.sale.DateSold || ""
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    componentDidMount() {
        this.fetchCustomer();
        this.fetchProduct();
        this.fetchStore();
    }
    //Fetching data from Database
    fetchCustomer() {
        this.setState({
            isLoading: true,
            custList: []
        })
        fetch('/Customer/GetCustomerData/')
            .then(response => response.json())
            .then(custList => this.setState({
                custList: custList,
                isLoading: true
            }));
    }
    //Fetching data from Database
    fetchProduct() {
        this.setState({
            isLoading: true,
            proList: []
        })
        fetch('/Product/GetProductData/')
            .then(response => response.json())
            .then(proList => this.setState({
                proList: proList,
                isLoading: true
            }));
    }
    fetchStore() {
        this.setState({
            isLoading: true,
            StoreList: []
        })
        fetch('/Store/GetStoreData/')
            .then(response => response.json())
            .then(StoreList => this.setState({
                StoreList: StoreList,
                isLoading: true
            }));
    }
    handleChange(event, { name, value }) {
        this.setState(state => ({ Info: { ...state.Info, [name]: value } }));
    }

    save() {
        const saleToSave = { ...this.props.sale, ...this.state.Info };
        this.props.save(saleToSave);
    }
    
    cancel() {
        this.props.cancel();
    }

    render() {
        return (
            <Modal open={this.props.isOpen}>
                <Modal.Header>{this.props.header}</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.save}>

                        <Form.Input
                            required
                            label="Date Sold"
                            name="DateSold"
                            value={this.state.Info.DateSold}
                            onChange={this.handleChange}
                        />
                                                   
                        <Form.Select
                            required
                            label="Customer"
                            name="CustomerId"
                            onChange={this.handleChange}
                            placeholder='Select Customer'
                            options={
                                this.state.custList.map(cust => ({
                                    key: cust.Id,
                                    value: cust.Id,
                                    name: cust.Id,
                                    text: cust.Name

                                }))
                            }
                        />
                        <Form.Select
                            required
                            onChange={this.handleChange}
                            placeholder='Select Product'
                            label="Product"
                            name="ProductId"
                            options={
                                this.state.proList.map(prod => ({
                                    key: prod.Id,
                                    value: prod.Id,
                                    name: prod.Id,
                                    text: prod.Name

                                }))
                            }
                        />
                        <Form.Select
                            required
                            onChange={this.handleChange}
                            placeholder='Select Store'
                            label="Store"
                            name="StoreId"
                            options={
                                this.state.StoreList.map(store => ({
                                    key: store.Id,
                                    value: store.Id,
                                    name: store.Id,
                                    text: store.Name

                                }))
                            }
                        />
                        
                        
                        <Form.Group>
                            <Form.Button type="submit" positive>
                                Save
              </Form.Button>
                            <Form.Button type="button" onClick={this.cancel}>
                                Cancel
              </Form.Button>
                        </Form.Group>
                    </Form>
                </Modal.Content>
            </Modal>
        );
    }
}