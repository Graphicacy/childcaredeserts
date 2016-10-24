import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import * as _ from 'lodash';
import MapContainer from './map/Map.container';
import Select from 'react-select';

import { stateListActions } from './sidebar/StateList.state';
import StateSelect from './sidebar/StateSelect.container';
import StateCharts from './sidebar/StateCharts.container';
import {
  getSelectedStateProperties,
  getStatesList,
  getStateDictionary,
  getZip,
  getZipOptions
} from './sidebar/Sidebar.selectors';


const body = encodeURIComponent(
  "Nearly half of ZIP codes in these 8 states are #ChildCareDeserts - is yours? "
  + window.location.href
)

const longBody = encodeURIComponent(
  "A new report from the Center for American Progress has found that nearly half of the ZIP codes " +
  "in 8 states are ‘Child Care Deserts.’ Enter your ZIP code to see whether you live in one of " +
  "these Child Care Deserts. " + window.location.href
);

const tweet = (
  "http://twitter.com/intent/tweet?text=" + body
);

const facebook = (
  "https://www.facebook.com/sharer/sharer.php?u=" + window.location.href
);

const mailto = (
  "mailto:?body=" + longBody
);


const mapStateToProps = (state) => {
  const selectedState = getSelectedStateProperties(state);
  const obj = {
    mobile: state.sidebar.stateList.mobile,
    statesList: getStatesList(state),
    selectedState,
    stateDemographics: state.sidebar.stateList.stateDemographics,
    showAbout: state.sidebar.stateList.showAbout,
    dictionary: getStateDictionary(state),
    selectedZip: getZip(state),
    zipOptions: getZipOptions(state)
  };
  return obj;
};


const ChildCareDesertsAppContainer = React.createClass({

  propTypes: {
    // actions
    fetchStates: PropTypes.func.isRequired,
    updateDimensions: PropTypes.func.isRequired,
    selectedState: PropTypes.object,
    statesList: PropTypes.array,
    selectState: PropTypes.func.isRequired,
    mobile: PropTypes.bool,
    resetSelection: PropTypes.func.isRequired,
    stateDemographics: PropTypes.object,
    showAbout: PropTypes.bool,
    showAboutData: PropTypes.func,
    hideAboutData: PropTypes.func,
    dictionary: PropTypes.object,
    selectedZip: PropTypes.string,
    setZip: PropTypes.func.isRequired,
    zipOptions: PropTypes.array
  },
  componentWillMount() {
    this.props.updateDimensions();
  },
  componentDidMount() {
    this.props.fetchStates();
    window.addEventListener('resize', this.props.updateDimensions);
  },
  componentWillUnmount() {
    window.removeEventListener('resize', this.props.updateDimensions);
  },

  onResetSelection() {
    this.props.resetSelection();
  },

  componentDidUpdate() {
    if (this.props.mobile && this.aboutElement && ('scrollIntoView' in this.aboutElement)) {
      this.aboutElement.scrollIntoView();
    }
  },

  render() {
    const mobile = this.props.mobile;
    const showAbout = this.props.showAbout;
    const selectedState = !!this.props.selectedState;
    const hideMap = mobile && !selectedState;


    const createCell = state => {
      const padded = _.padStart(state.id, 2, '0');
      return (
        <Col className="state-cell"
             xs={3}
             key={state.id}
             onClick={() => this.props.selectState(state.stateProperties)}>
          <div className="image">
            <div style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url("./images/state-${padded}.png")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center'
            }}>
            </div>
          </div>
          <div className="description">
            <div className="description-header">
              {state.stateProperties.NAME}
            </div>
            {this.props.stateDemographics[padded].text_box_abbr}
          </div>
        </Col>
      );
    };

    const stateListSorted = _.sortBy(
      this.props.statesList,
      state => state.stateProperties.NAME
    );

    const grid = (mobile || this.props.selectedState || !this.props.statesList) ? '' : (
      <Grid className="state-grid">
        <Row className="state-row">
          {stateListSorted.slice(0,4).map(createCell)}
        </Row>
        <Row className="state-row">
          {stateListSorted.slice(4).map(createCell)}
        </Row>
      </Grid>
    );


    const about = !showAbout ? '' : (
      <div className="about-the-data" ref={(el) => this.aboutElement = el}>
        <i className="icon-close icons" onClick={this.props.hideAboutData}></i>
        <div className="description-header">About the data</div>
        <p>
          The Center for American Progress collected data on the location and
          capacity of all licensed child care centers in eight states.
          While data were requested from most states across the country,
          many agencies did not respond to the authors’ requests or chose
          not to share administrative data on child care centers, resulting
          in this subset. These eight relatively populous states contain
          one-fifth of the U.S. population under age 5.
        </p>
        <br/>
        <p>
          The administrative data on child care center locations included a
          ZIP code for each center. Using data from the U.S. Bureau of the
          Census, “American Community Survey, 2010–2014 5-Year Estimates,”
          the authors matched each location with estimates of that ZIP code’s
          demographic, geographic, and economic characteristics.
          This merged data set was used to compare and analyze the prevalence
          of child care deserts among ZIP codes of differing types: rural,
          suburban, and urban; low, moderate, and high poverty; and
          those with varying racial demographic profiles.
        </p>
        <br/>
        <p>
          A child care desert is defined as any ZIP code with more than
          30 children under age 5 that contains either zero child care
          centers or so few centers that there are more than three times
          as many young children as there are spaces in centers.
        </p>
        <br/>
        <p>
          This study aims to identify whether rural, suburban, or urban areas
          have a significantly different child care center supply. Since to a
          certain extent these categories are a subjective evaluation,
          this question posed a difficult challenge. Inspired by research
          from economist Jed Kolko, this study used household density—that is,
          the number of occupied households per square mile—to categorize each
          ZIP code as rural, suburban, or urban. As the chief economist at a
          real estate search website, Kolko and his team conducted a national
          survey to develop a predictive model of the local characteristics
          associated with whether people said they lived in an urban, suburban,
          or rural area. This research concluded that the strongest predictor of
          how someone described their ZIP code’s urbanicity was the number of
          occupied housing units per square mile.
        </p>
        <br/>
        <p>
          Some cities—such as Chicago—are primarily urban, as they are densely
          populated. Other cities—such as Atlanta—are mostly coded as suburban
          since they are more spread out and less densely populated. This
          matches with the general understanding of Atlanta as one of the
          more sprawling cities in the United States. One resulting strength
          of this analysis is that it treats the sprawling suburbs of Atlanta
          as having a fundamentally different residential character than the
          high-rise neighborhoods of Chicago.
        </p>
        <br/>
        <p>
          More information about the authors’ methodology and findings can be
          found in the report &nbsp;
          <a className="report-link"
            href="https://www.americanprogress.org/?p=225703">
            "Child Care Deserts: An Analysis of Child Care
            Centers by ZIP Code in 8 States".
          </a>
        </p>
      </div>
    );

    const zipSelectOptions = _.chain(this.props.zipOptions)
      .map(z => ({ label: z, value: z }))
      .filter(z => Number(z.label) > 0)
      .sortBy(z => Number(z.label))
      .value();

    const selectedZip = this.props.selectedZip && {
      label: this.props.selectedZip,
      value: this.props.selectedZip
    };

    return (
      <div className='app-container'>
        <div className="header">
          <a className="logo-link"
             href="https://www.americanprogress.org/" target="_blank">
            <img className="logo" src="./images/cap-logo-fullcolor.png"/>
          </a>
          <div className="info-buttons">
            <span className="info no-mobile">
              <a href="https://www.americanprogress.org/?p=225703">
                DOWNLOAD THE REPORT
                <i className="icon-info icons"></i>
              </a>
            </span>
            <span className="info no-mobile"
                  onClick={this.props.showAboutData}>
              ABOUT THE DATA
              <i className="icon-info icons"></i>
            </span>
            <span className="info share">
              <a href={tweet} target="__blank">
                <i className="fa fa-twitter"></i>
              </a>
              <a href={facebook} target="__blank">
                <i className="fa fa-facebook-square"></i>
              </a>
              <a href={mailto} target="__blank">
                <i className="fa fa-envelope"></i>
              </a>
            </span>
          </div>
        </div>
        <div className="content-container">
          <div className={'sidebar-container state-select-container' + (!selectedState ? ' opaque' : '')}>
            <StateSelect/>
            { mobile
              ? ''
              : <StateCharts/>
            }
          </div>
          <div>
            {grid}
          </div>
          <div>
            {mobile ? '' : about}
          </div>
          <div className={hideMap ? 'map-components hide-map' : 'map-components' }>
            <div className="map-controls">
              <span className="map-select">
                <Select
                    name="map-state"
                    options={zipSelectOptions}
                    value={selectedZip}
                    placeholder="Search for your zipcode"
                    onChange={selected => {
                      this.props.setZip(selected && selected.value);
                    }}
                />
              </span>
            </div>
            <MapContainer/>
          </div>
          <div>
            { mobile
              ? (
              <div className='sidebar-container opaque'>
                <StateCharts/>
                <span className="info mobile-about-data">
                  DOWNLOAD THE REPORT
                  <i className="icon-info icons"></i>
                </span>
                <span className="info mobile-about-data"
                      onClick={this.props.showAboutData}>
                  ABOUT THE DATA
                  <i className="icon-info icons"></i>
                </span>
              </div>
              )
              : ''
            }
          </div>
          <div>
            {mobile ? about : ''}
          </div>
        </div>
      </div>
    );
  }
});

export default connect(mapStateToProps, { ...stateListActions })(ChildCareDesertsAppContainer);
