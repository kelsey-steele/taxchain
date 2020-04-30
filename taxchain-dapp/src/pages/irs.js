import React, {Component} from "react";
import {connect} from "react-redux";
import { getTaxRate, getAllEmployee, getAllEmployeeTotalIncomeList} from "../common/contractMethods";
import EmployeeCard from "../components/employeecard";
import ChangeTaxRate from "../components/changeTaxRate";
import {Pagination, Grid, Segment, Dimmer, Loader, Image, Icon, Statistic, Tab } from "semantic-ui-react";

// TODO: implement start date and end Date
// TODO: Calculate current tax based off start/End
// TODO: implement employer count
// TODO: ability to add IRS account
// TODO: add page numbers to employees
// TODO: have all tabs update when changing Tax Rate - redux matter?
//      the reloading problem was also a problem with the zombie app.
//      leave it? Add reminder to refresh the page? Add a force reload? tbd

// TODO: change year arg for getAllEmployeeTotalIncomeList method in componentDidMount


class IRS extends Component {

    state = {
        selectedType : "irs",
        registerMessageVisible : true,
        errorMessage: "",
        employee:[],
        salaries : [],
        incomeTaxRate : .1,

        totalEmployers : 0,
        totalEmployees : 0,
        totalIncomeTax : 0,
        totalSalaries : 0,
        tabIndex : 1,
    }

    async componentDidMount() {
        //Get address and salary for all employees when component mount
        try {
            const result = await getAllEmployee(this.props.taxChainContract, this.props.userAddress);
            const salary = await getAllEmployeeTotalIncomeList(this.props.taxChainContract, 2020, this.props.userAddress);
            this.setState({
                errorMessage: "Successfully Retrieved Tax Information",
                employee: result,
                totalEmployees: result.length,
                salaries: salary,
            })

            await this.setTaxRate();
            await this.setTotalIncomeTax();

        } catch (err) {
            console.log(err);
            this.setState({
                errorMessage: "Failed To Retrieve Tax Information"
            });
        }
        setTimeout(() => {
            this.setState({ loadingFinished: true });
        }, 1000);
    }

    setTaxRate = async () => {
        let taxRate = await getTaxRate(this.props.taxChainContract);

        this.setState({
            incomeTaxRate: taxRate,
        });
    }

    setTotalIncomeTax = async () => {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let totalSalaries = this.state.salaries.map(Number).reduce(reducer);
        let totalIncomeTax = totalSalaries*this.state.incomeTaxRate/100;

        this.setState({
            totalIncomeTax: totalIncomeTax,
            totalSalaries: totalSalaries,
        });
    }

    getOverviewPane = () => {
      let OverviewPane = (
        <div>


        <Segment>
            <Statistic.Group widths='two'>

            <Statistic>
                <Statistic.Value>
                    {this.state.totalEmployers}
                </Statistic.Value>
                <Statistic.Label>Total Employers</Statistic.Label>
            </Statistic>

                <Statistic>
                    <Statistic.Value>
                        {this.state.totalEmployees}
                    </Statistic.Value>
                    <Statistic.Label>Total Employees</Statistic.Label>
                </Statistic>

            </Statistic.Group>
        </Segment>

        <Segment>
            <Statistic.Group widths='three'>

            <Statistic>
                <Statistic.Value>
                    <Icon name="dollar" />{this.state.totalSalaries}
                </Statistic.Value>
                <Statistic.Label>Total Salary Amount</Statistic.Label>
            </Statistic>

                <Statistic>
                    <Statistic.Value>
                        <Icon name="percent" />{this.state.incomeTaxRate}
                    </Statistic.Value>
                    <Statistic.Label>Income Tax Rate</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value>
                        <Icon name="dollar" />{this.state.totalIncomeTax}
                    </Statistic.Value>
                    <Statistic.Label>Total Income Tax</Statistic.Label>
                </Statistic>

            </Statistic.Group>
        </Segment>

        <Dimmer active={!this.state.loadingFinished} inverted>
            <Loader inverted active={!this.state.loadingFinished}>Loading</Loader>
        </Dimmer>

        <Image hidden={this.state.loadingFinished} src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
        </div>
      );
      let paneName = 'Overview';

      return {
        menuItem: paneName,
        render: () => <Tab.Pane>{OverviewPane}</Tab.Pane>
      }
    }

    getEmployersPane = () => {
      let EmployersPane = (
        <div>
          meow
        </div>
      );
      let paneName = 'Employers';

      return {
        menuItem: paneName,
        render: () => <Tab.Pane>{EmployersPane}</Tab.Pane>
      }
    }

    getEmployeesPane = () => {
      let employeesPane = (
          <div>
            <b>All Employees</b>
            <Grid>
            {
                //mapping through all employee address from state variable and setting EmployeeCard Component for each of these addresses.
                this.state.employee.map((employeeAddress, index) => {
                    return(<Grid.Column width={5} key={employeeAddress}><EmployeeCard addr={employeeAddress} salary={this.state.salaries[index]} taxRate={this.state.incomeTaxRate} /></Grid.Column>)
                })
            }
            </Grid>
          </div>
      );
      let paneName = 'Employees';

      return {
        menuItem: paneName,
        render: () => <Tab.Pane>{employeesPane}</Tab.Pane>
      }
    }

    getChangeTaxRatePane = () => {
      let ChangeTaxRatePane = (
            <ChangeTaxRate taxChainContract={this.props.taxChainContract} userAddress={this.props.userAddress} />
      );
      let paneName = 'Change Tax Rate';

      return {
        menuItem: paneName,
        render: () => <Tab.Pane>{ChangeTaxRatePane}</Tab.Pane>
      }
    }

    getAddIRSAddrPane = () => {
      let AddIRSAddrPane = (
          <div>
            Coming soon :)
          </div>
      );

      let paneName = 'Add New IRS Account';

      return {
        menuItem: paneName,
        render: () => <Tab.Pane>{AddIRSAddrPane}</Tab.Pane>
      }
    }

    render() {
        let allPanes = [
            this.getOverviewPane(),
            this.getEmployeesPane(),
            this.getEmployersPane(),
            this.getChangeTaxRatePane(),
            this.getAddIRSAddrPane(),
        ];
        return (
            <div>
                <Segment hidden={this.state.errorMessage === ""}>
                  {this.state.errorMessage}
                </Segment>
                <Tab panes={allPanes} />
            </div>



        );
    }
}

function mapStateToProps(state) {
    return {
        taxChainContract: state.taxChainContract,
        userAddress: state.userAddress,
    }
}
export default connect(mapStateToProps)(IRS);
