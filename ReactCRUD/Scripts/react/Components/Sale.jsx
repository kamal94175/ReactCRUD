import React from "react";
import ReactDOM from "react-dom";
import { Table, Button, Icon, Confirm, Container } from "semantic-ui-react";
import Formsale from "./Formsale.jsx";
import Navbar from "./Navbar.jsx";


export default class Sale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saleList: [],
            isLoaded: false,
            error: null,
            showModal: false,
            showConfirm: false,
            sale: {}
        };
        this.addNew = this.addNew.bind(this);
        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.showDelete = this.showDelete.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }
    //Fetching data from Database
    fetchData() {
        this.setState({
            isLoading: true,
            saleList: []
        })
        fetch('/Sales/GetSalesData/')
            .then(response => response.json())
            .then(saleList => this.setState({
                saleList: saleList,
                isLoading: true
            }));
    }
    // Functions for ADD and Edit Modals
    addNew() {
        this.setState({
            sale: {}, // Try commenting out this code and see.
            showModal: true
        });
    }

    edit(saleToEdit) {
        this.setState({
            sale: saleToEdit,
            showModal: true
        });
    }

    cancel() {
        this.setState({
            showModal: false
        });
    }

    save(saleToSave) {
        const closeModal = () => this.setState({ showModal: false });
        if (saleToSave.Id) {
            this.update(saleToSave, closeModal);
        } else {           
            this.create(saleToSave, closeModal);// We didn't have an id so this means we created a new one.
        }
    }
    // Adding a new saleomer
    create(saleToCreate, callback) {
        const createsale = JSON.stringify(saleToCreate);

        fetch("/Sales/Create/", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: createsale
        }) // We're parsing the response as JSON.
            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {
                    this.setState(state => {
                        fetch('/Sales/GetSalesData/')
                            .then(response => response.json())
                            .then(saleList => this.setState({
                                saleList: saleList,
                                isLoading: true
                            }));
                      }, 
                    callback);
                } else {
                    this.setState(
                        {
                            error: bodyAsObject.message
                        },
                        callback
                    );
                }
            })
            .catch(error => {
                this.setState(
                    {
                        error: "There was an error communicating with the back-end"
                    },
                    callback
                );
            });
    }
    // Editing saleomer details
    update(saleToUpdate, callback) {

        const editsale = JSON.stringify(saleToUpdate);

        fetch(
            "/Sales/Edit/" +
            saleToUpdate.Id,
            {
                method: "PUT",
                headers: new Headers({
                    "Content-Type": "application/json"
                }),
                body: editsale
            })

            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {
                   
                    this.setState(state => {
                        fetch('/Sales/GetSalesData/')
                            .then(response => response.json())
                            .then(saleList => this.setState({
                                saleList: saleList,
                                isLoading: true
                            }));
                        //      {
                        //       saleList: updatedsaleList
                           },
                        callback
                    );
                } else {
                    this.setState(
                        {
                            error: bodyAsObject.message
                        },
                        callback
                    );
                }
            })
            .catch(error => {
                this.setState(
                    {
                        error: "There was an error communicating with the back-end"
                    },
                    callback
                );
            });
    }
    // Functions for Delete Modals
    showDelete(saleToDelete) {
        this.setState({
            showConfirm: true,
            sale: saleToDelete
        });
    }

    cancelDelete() {
        this.setState({
            showConfirm: false,
            sale: {}
        });
    }

    confirmDelete() {
        this.setState({ showConfirm: false });
        const saleToDelete = this.state.sale;
        if (saleToDelete.Id) {
            this.delete(saleToDelete);
        }
    }
    // Deleting the data from database
    delete(saleToDelete) {
        fetch(
            "/Sales/Delete/" +
            saleToDelete.Id, {

            })
            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {
                    const updatedsaleList = this.state.saleList.filter(
                        sale => sale.Id != saleToDelete.Id
                    );

                    // Update the state.
                    this.setState({ saleList: updatedsaleList });
                } else {
                    this.setState({ error: bodyAsObject.message });
                }
            })
            .catch(error => {
                this.setState({
                    error: "There was an error communicating with the back-end"
                });
            });
    }

    render() {

        return this.state.error ? (
            <div>{this.state.error}</div>
        ) : (
                <Container>
                    <Navbar />
                    <React.Fragment>
                        {this.state.showModal && (
                            <Formsale
                                isOpen={true}
                                sale={this.state.sale}
                                header={this.state.sale.Id ? "Edit" : "Add"}
                                save={this.save}
                                cancel={this.cancel}
                            />
                        )}
                        {this.state.showConfirm && (
                            <Confirm
                                open={true}
                                onCancel={this.cancelDelete}
                                onConfirm={this.confirmDelete}
                            />
                        )}
                        <div className="mt-5">
                            <Button className="ui primary button" onClick={this.addNew}>
                                Add New</Button>                     
                        </div>
                        <Table striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Customer Name</Table.HeaderCell>
                                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                                    <Table.HeaderCell>Store Name</Table.HeaderCell>
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.saleList.map(sale => (
                                    <Table.Row key={sale.Id}>
                                        <Table.Cell>{sale.CustomerName}</Table.Cell>
                                        <Table.Cell>{sale.ProductName}</Table.Cell>
                                        <Table.Cell>{sale.StoreName}</Table.Cell>
                                        <Table.Cell>{sale.DateSold}</Table.Cell>
                                        <Table.Cell>
                                            <Button className="ui yellow button"
                                                onClick={() => this.edit(sale)}>
                                                <i className="edit icon"></i>Edit</Button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button className="ui red button"
                                                onClick={() => this.showDelete(sale)}>
                                                <i className="trash icon"></i>Delete</Button>

                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </React.Fragment>

                </Container>);
    }


}


const rootElement = document.getElementById("Salesmain");
ReactDOM.render(<Sale />, rootElement);
