import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import Menu from './MenuComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import DishDetail from './DishdetailComponent';
import { addComment, fetchDishes } from '../redux/ActionCreators';

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    leaders: state.leaders,
    promotions: state.promotions
  };
};

const mapDispatchToProps = dispatch => ({
  addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment)),
  fetchDishes: () => { dispatch(fetchDishes()) },
  resetFeedbackForm: () => { dispatch(actions.reset('feedback') ) }
});

class Main extends Component {
  constructor(props) {
    super(props);
    
  }

  componentDidMount() {
    this.props.fetchDishes();
  }

  render() {
    const HomePage = () => {
      return <Home dish={this.props.dishes.dishes.find(item => item.featured)}
        dishesLoading={this.props.dishes.isLoading}
        dishesErrMess={this.props.dishes.errMessage}
        promotion={this.props.promotions.find(item => item.featured)}
        leader={this.props.leaders.find(item => item.featured)} />;
    };

    const DishWithId = ({match}) => {
      return (
        <DishDetail dish={this.props.dishes.dishes.find(item => item.id === parseInt(match.params.dishId, 10) )}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMessage}
          comments={this.props.comments.filter(comment => comment.dishId === parseInt(match.params.dishId, 10))}
          addComment={this.props.addComment} />
      );
    };

    return (
      <div>
        <Header />
        <Switch>
          <Route path="/home" component={HomePage} />
          <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes} /> } />
          <Route path="/menu/:dishId" component={DishWithId} />
          <Route exact path="/contactus" component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} />} />
          <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders} />} />
          <Redirect to="/home" />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
