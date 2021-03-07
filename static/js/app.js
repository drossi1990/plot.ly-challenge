function retrieve_metadata(sample) {
    //retrieve metadate from json, filter results by sample #, and clear existing metadata
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      console.log(metadata)
      var samplesarray= metadata.filter(sampleobject => sampleobject.id == sample);
      var samp_return= samplesarray[0]
    //   console.log(result)
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");
      Object.entries(samp_return).forEach(([samp, prev]) => {
        PANEL.append("h3").text(`${samp}: ${prev}`);
      });

    });
  }
  
  function chart_constructor(sample) {
    d3.json("samples.json").then((data) => {
      var bb_samples = data.samples;
      var bb_results = bb_samples.filter(sampleObj => sampleObj.id == sample);
      var culture_result = bb_results[0];
  
      var sample_ids = culture_result.otu_ids;
      var sample_labels = culture_result.otu_labels;
      var sample_strains = culture_result.sample_values;
  
      var xticks = sample_ids.slice(0, 15).map(otuID => `OTU ${otuID}`).reverse();
      var bar_data = [
        {
          y: sample_strains.slice(0, 15).reverse(),
          x:xticks,
          text: sample_labels.slice(0, 15).reverse(),
          type: "bar",
          marker:{
          color: 'green'},
          orientation: "l",
        }
      ];
  
      var bar_layout = {
       title: "Top 15 Most Prevalent Cultures in Sample",
       xaxis: {
        tickangle: -45
      },
        margin: { t: 40, l: 40 }
      };
  
      Plotly.newPlot("bar", bar_data, bar_layout);
    });
  }
  
  function Initialize() {
  console.log("Initialized")
    //grabs a reference to the dropdown menu from the index
    var dropdown = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sample_list = data.names;
  
      sample_list.forEach((sample) => {
        dropdown
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // takes the initial sample for the list to display chart data before user makes additional input 
      var init_sample = sample_list[0];
      chart_constructor(init_sample);
      buildMetadata(init_sample);
    });
  }
  
  function optionChanged(user_selection) {
    // updates dashboard with user selection of a new data sample
    chart_constructor(user_selection);
    buildMetadata(user_selection);
  }
  
  //launch the dashboard
  Initialize();
  