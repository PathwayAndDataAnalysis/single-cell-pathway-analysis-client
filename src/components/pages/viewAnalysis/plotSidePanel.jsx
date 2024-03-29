import {useEffect, useState} from "react";
import {getGeneEXpressionColumnsHandler, getMetadataColumnsHandler} from "../../api/apiHandlers";
import {DropDownLayoutCompact} from "../../other/dropDownLayoutCompact";
import {InputLayoutCompact} from "../../other/inputLayoutCompact";
import {ColorPaletteDropDown} from "../../other/colorPaletteDropDown";
import {ActionButton} from "../../buttons/actionButton";
import {AddNewGeneLayout} from "./addNewGeneLayout";

export function PlotSidePanel({analysisName, onGeneExpressionColumnChange, onColumnChange, onNewGeneEnter, onSubmitGenes}) {

    const [metadataColumns, setMetadataColumns] = useState([]);
    const [geneExpressionColumns, setGeneExpressionColumns] = useState([]);

    const getMetaDataColumns = () => {
        getMetadataColumnsHandler(analysisName)
            .then(res => {
                setMetadataColumns(res.data.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const getGeneExpressionColumns = () => {
        getGeneEXpressionColumnsHandler(analysisName)
            .then(res => {
                setGeneExpressionColumns(res.data.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        getMetaDataColumns(analysisName);
        getGeneExpressionColumns();
    }, [analysisName]);


    return (<div className="h-screen col-span-1 bg-gray-100 rounded-md py-8">
        <div>
            <DropDownLayoutCompact label="Select trajectory"
                                   options={["1", "2", "3"]}/>

            <InputLayoutCompact inputFor="Select source cell"
                                placeholder="Source cell"
                                onChange={() => {
                                }}
            />

            <InputLayoutCompact inputFor="Select target cell"
                                placeholder="Target cell"
                                onChange={() => {
                                }}
            />

            <InputLayoutCompact inputFor="Name of the trajectory"
                                placeholder="Trajectory name"
                                onChange={() => {
                                }}
            />

            <DropDownLayoutCompact label="Optimize distance"
                                   options={["Squared euclidean", "Mean square error"]}/>

            <p>.</p>


            <AddNewGeneLayout
                onChange={(event) => {
                    onNewGeneEnter(event.target.value)
                }}
                onSubmit={() => {
                    onSubmitGenes()
                }}
            />

            <p>.</p>

            <ColorPaletteDropDown label="Select Expression Gene Column"
                                  options={["Gene Expression Column", ...geneExpressionColumns]}
                                  onChange={(event) => {
                                      onGeneExpressionColumnChange(analysisName, event.target.value);
                                  }}
            />

            <p>.</p>

            <ColorPaletteDropDown label="Select Meta Column"
                                  options={["Meta Data Column", ...metadataColumns]}
                                  onChange={(event) => {
                                      onColumnChange(analysisName, event.target.value);
                                  }}
            />


            <div className="">
                <ActionButton text="Calculate trajectory"
                              onClick={() => {
                              }}
                              type="button"
                />
                <ActionButton text="Save trajectory"
                              onClick={() => {
                              }}
                              type="button"
                />
            </div>

        </div>
    </div>);
}
