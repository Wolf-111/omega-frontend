import React, {useState} from "react";
import "../../App.scss";
import {Modal, Popover} from "antd";
import AutoSuggest from "react-autosuggest";
import {InfoCircleOutlined} from "@ant-design/icons";
import AddToLayoutButton from "./AddToLayoutButton";
import Earnings from "../Cards/Earnings";
import AnalystRecommendations from "../Cards/AnalystRecommendations";
import Dividends from "../Cards/Dividends";
import Price from "../Cards/Price";
import PriceTarget from "../Cards/PriceTarget";
import News from "../Cards/News";
import EarningsRatio from "../Cards/EarningsRatio";
import CompareReturns from "../Cards/CompareReturns";
import CorrelatedMarkets from "../Cards/CorrelatedMarkets";
import Risk from "../Cards/Risk";
import DebtToAssets from "../Cards/DebtToAssets";
import RevenueToProfit from "../Cards/RevenueToProfit";
import ResearchAndDevelopment from "../Cards/ResearchAndDevelopment";
import InstitutionalOwnership from "../Cards/InstitutionalOwnership";
import InsiderTrading from "../Cards/InsiderTrading";
import ComparingCEOPay from "../Cards/ComparingCEOPay";
import CEOPayBreakdown from "../Cards/CEOPayBreakdown";
import InsidersPie from "../Cards/InsidersPie";
import TopInsiders from "../Cards/TopInsiders";
import PoliticalInsiders from "../Cards/PoliticalInsiders";

const AddCardModal = (props) => {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const selectCard = (id) => {
        // Card was selected, remove it
        if (props.selectedCardsIndex.includes(id)) {
            props.setSelectedCardsIndex((prevSelected) =>
                prevSelected.filter((cardId) => cardId !== id)
            );
        }

        // Card was not selected, add it
        else {
            props.setSelectedCardsIndex((prevSelected) => [...prevSelected, id]);
        }
    };

    // Shows modal
    const showModal = () => {
        setModalVisible(true);
        setIsLoading(true);
    };

    // Handles exit of modal
    const handleExit = () => {
        setModalVisible(false);
    };

    // This is an object containing every available card that users have access to
    const availableCardsObject = {
        Earnings,
        AnalystRecommendations,
        Dividends,
        Price,
        PriceTarget,
        News,
        EarningsRatio,
        CompareReturns,
        CorrelatedMarkets,
        Risk,
        DebtToAssets,
        RevenueToProfit,
        ResearchAndDevelopment,
        InstitutionalOwnership,
        // CustomFundamentals,
        InsiderTrading,
        CEOPayBreakdown,
        ComparingCEOPay,
        InsidersPie,
        TopInsiders,
        PoliticalInsiders
    };

    return (
        <React.Fragment>
            <i
                style={{cursor: "pointer"}}
                onClick={showModal}
                className="fi-rr-apps-add top-nav-icon"
            />
            <Modal
                title="Add Card"
                className="add-card-modal"
                visible={modalVisible}
                footer={null}
                onCancel={handleExit}
            >
                {/* Autosuggest form that allows user to search for specific cards */}
                <form
                    className="form-inline ml-auto col-lg-7"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <AutoSuggest
                        suggestions={suggestions}
                        getSuggestionValue={(suggestion) => suggestion.value}
                        renderSuggestion={(suggestion) => {
                            <React.Fragment>{suggestion.value}</React.Fragment>;
                        }}
                        onSuggestionsClearRequested={() => setSuggestions([])}
                        onSuggestionsFetchRequested={({value}) => {
                            setValue(value);
                        }}
                        inputProps={{
                            placeholder: "Search card",
                            value: value,
                            onChange: (_, {newValue, method}) => {
                                setValue(newValue);
                            },
                        }}
                    />
                </form>

                <div className="add-card-container">
                    <div className="row">
                        {props.availableCards.map((card) => {
                            // These conditions must be met in order for a card to be rendered
                            // in the AddCardModal
                            const defaultConditionals = !props.selectedCardsIndex.includes(card.id) && card.title.toLowerCase().includes(value.toLowerCase());

                            const extra = (
                                <React.Fragment>
                                    <Popover
                                        content={card.info}
                                        title={card.title}
                                        trigger="click"
                                        visible={card.infoVisible}
                                    >
                                        <span className="span-margin">
                                          <InfoCircleOutlined
                                              className="blue-button"
                                              onClick={() =>
                                                  // Display info correlating to the card the user just clicked the info button on
                                                  props.setAvailableCards((arr) =>
                                                      arr.map((item) =>
                                                          item.id === card.id
                                                              ? {...item, infoVisible: !item.infoVisible}
                                                              : item
                                                      )
                                                  )
                                              }
                                          />
                                        </span>
                                    </Popover>
                                </React.Fragment>
                            );

                            // If the name of the card is an available card & defaultConditionals are met, return the card
                            if (card.name in availableCardsObject && defaultConditionals) {

                                // Instead of returning every single individual card, we simply use logic that allows us to
                                // render each card within availableCardsObject and assign each card it's corresponding data
                                const CustomTag = availableCardsObject[card.name];

                                return (
                                    <div className="col-xl-4 modal-card">
                                        <CustomTag
                                            {...card}
                                            extra={extra}
                                            darkMode={props.darkMode}
                                            activeTicker={props.activeTicker}
                                        />
                                        <AddToLayoutButton selectCard={selectCard} card={card}/>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default AddCardModal;
