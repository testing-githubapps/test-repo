/**
 * The main module for generating charts and graphs related to the bootcamp metadata.
 * @module bootcampCharts
 */

import Chart from 'chart.js/auto';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { fetchMetadata } from './read-metadata';

// Register the wordCloud controller, element, and scale with Chart.js.
// Starting in Chart.js 3 iirc they support 'tree shaking' which means
// componenets have to be registered explicitly so bundlers like webpack
// can effectively remove unused controllers when minifying
Chart.register(WordCloudController, WordElement);

/**
 * Generates a doughnut chart displaying the breakdown of time spent on each category of exercises in the bootcamp.
 *
 * @param {string} canvasId - The ID of the canvas element to use for the chart.
 */
function generateCategoryDoughnutChart(canvasId, bootcampMetadata) {
    if (bootcampMetadata === null) {
        return;
    }
    var canvas = document.getElementById(canvasId);

    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    let categoryData = {};

    // Aggrigate all time spent in each category.
    for (const doc of Object.values(bootcampMetadata)) {
        if ('category' in doc && 'estReadingMinutes' in doc) {
            // Create bucket for categories and add reading time
            if (doc.category in categoryData) {
                categoryData[doc.category] += doc.estReadingMinutes;
            } else {
                categoryData[doc.category] = doc.estReadingMinutes;
            }

            if ('exercises' in doc) {
                doc.exercises.forEach(exercise => {
                    if ('estMinutes' in exercise) {
                        categoryData[doc.category] += exercise.estMinutes;
                    }
                });
            }
        }
    }

    const totalTime = Object.values(categoryData).reduce((acc, t) => { return acc + t }, 0);

    const data = {
        labels: Object.keys(categoryData),
        datasets: [{
            label: '',
            data: Object.values(categoryData).map((t) => { return t / totalTime })
        }]
    }

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Bootcamp Breakdown by Category',
                font: {
                    family: 'Open Sans, sans-serif',
                    size: 30
                }
            },
            tooltip: {
                font: {
                    family: 'Open Sans, sans-serif',
                    size: 30
                },
                callbacks: {
                    label: (toolTip) => {
                        let label = toolTip.dataset.label || '';
                        let value = parseInt(toolTip.formattedValue * 100) + '%';
                        return `${label}: ${value}`
                    }
                }
            }
        }
    }

    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

function bootcampTotals(bootcampMetadata) {
    if (bootcampMetadata === null) {
        console.error("Chapter hours cannot be computed bootcampMetadata");
        return;
    }

    let totalMinutes = 0;
    for (const section of Object.values(bootcampMetadata)) {
        totalMinutes += 'estReadingMinutes' in section ? section.estReadingMinutes : 0;
        if ('exercises' in section) {
            totalMinutes += section.exercises.reduce((acc, curTask) => {
                return acc += curTask.estMinutes;
            }, 0);
        }
    }

    // Populate markdown talbe
    const totalHours = Math.round(totalMinutes / 60);
    const totalWeeks = Math.ceil(totalHours / 20);

    // We target a 6 month bootcamp.
    const totalStyle = totalWeeks <= (6 * 4) ? 'green' : 'red'

    const totalHoursElement = document.getElementById('total-hours');
    totalHoursElement.style.color = totalStyle;
    totalHoursElement.innerText = totalHours;

    const totalWeeksElement = document.getElementById('total-weeks');
    totalWeeksElement.style.color = totalStyle;
    totalWeeksElement.innerText = totalWeeks;
}

function populateChapterHours(bootcampMetadata) {
    if (bootcampMetadata === null) {
        console.error("Chapter hours cannot be computed bootcampMetadata");
        return;
    }
    const chapterRegex = /docs\/(.+)\/\d.+/;
    const chaptersTotalMinutes = {};


    for (let [k, v] of Object.entries(bootcampMetadata)) {

        // Aggrigate the total time for this section of the bootcamp
        let sectionTotalMinutes = v['estReadingMinutes'] || 0;
        // Add exercise estimates to section total time
        if ('exercises' in v) {
            sectionTotalMinutes += v.exercises.reduce((acc, currentValue) => {
                return acc + currentValue.estMinutes;
            }, 0);
        }

        // Extract the chapter we are looping through
        const match = k.match(chapterRegex);
        const chapter = match[1] || null;

        // Aggrigate total minutes of a chapter
        if (chapter in chaptersTotalMinutes) {
            chaptersTotalMinutes[chapter] += sectionTotalMinutes;
        } else {
            chaptersTotalMinutes[chapter] = sectionTotalMinutes;
        }
    }

    // At this point we have a dictionary of chapter names (that is assmed to match id's of the inner paragraphs of the markdown table on the _stats page)
    // and the total number of minutes of exercises and reading in that chapter. Next we will populate the markdown table with hours.
    for (const [k, v] of Object.entries(chaptersTotalMinutes)) {
        const hours = Math.round(v / 60);
        document.getElementById(k).innerText = hours;
        document.getElementById(`${k}-weeks`).innerText = Math.ceil(hours / 20);
    }
}

// TODO: Fix this method. Right now the word cloud is too small and
// I have seen it 'blow up' the page (grows until the page crashes)
function generateWordCloud(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // This object will hold the number of occurances of a technology in the bootcamp
    let techCount = {};

    // Objects are not inherintly itterable in javascript so we must convert the values to an array.
    for (const doc of Object.values(bootcampMetadata)) {

        if ('technolgies' in doc) {
            // we have some top level technologies not associated to an exercise

        }
        // loop over exercises
        if ('exercises' in doc) {
            for (const exercise of Object.values(doc.exercises)) {
                if ('technologies' in exercise) {
                    for (const tech of exercise.technologies) {
                        if (tech in techCount) {
                            techCount[tech] += 1;
                        } else {
                            techCount[tech] = 1;
                        }
                    }
                }
            }
        }
    }

    const data = {
        labels: Object.keys(techCount),
        datasets: [
            {
                data: Object.values(techCount)
            }
        ]
    }

    const options = {
        title: {
            display: false,
            text: "Chart.js Word Cloud"
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    const myChart = new Chart(ctx, {
        type: 'wordCloud',
        data: data,
        options: options
    });
}

// This should be filled by the before each hook
let bootcampMetadata = null;


// Register chart generate on root document only after HTML has been appended to the DOM
// Docsify custom plugin boilerplate found https://docsify.js.org/#/write-a-plugin?id=template
(async function () {
    var generateCharts = function (hook, _vm) {

        // Invoked on each page load before new markdown is transformed to HTML.
        hook.beforeEach(async function (markdown, next) {
            // This could add a request to every page if bootcampMetadata is not found in local storage
            // might want to target just pages that will need this object but as a first pass doing it
            // everywhere
            try {
                bootcampMetadata = await fetchMetadata();
            } catch (error) {
                console.error(error);
            } finally {
                next(markdown);
            }
        });

        // Invoked on each page load before new markdown is transformed to HTML.
        hook.doneEach(function (markdown) {
            switch (window.location.hash) {
                case '#/':
                    generateCategoryDoughnutChart('category-doughnut-canvas', bootcampMetadata);
                    break;
                case '#/_stats':
                    populateChapterHours(bootcampMetadata);
                    bootcampTotals(bootcampMetadata);
                default:
                    break;
            }
            return markdown;
        });
    };

    // Add plugin to docsify's plugin array
    $docsify = $docsify || {};
    $docsify.plugins = [].concat(generateCharts, $docsify.plugins || []);
})();
