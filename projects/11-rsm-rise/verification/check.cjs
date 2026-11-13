// Current local verification targets the supplied v36. Earlier scripts are archived.
import('../v36/tests/flow.mjs').catch(error=>{console.error(error);process.exitCode=1;});
