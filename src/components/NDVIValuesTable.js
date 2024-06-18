import {Table, Badge} from 'react-bootstrap';

/**
 * Displays a table of NDVI values including average, maximum, minimum, and standard deviation.
 *
 * @param {Object} data - The data object containing NDVI statistics.
 * @param {number} data.average - The average NDVI value.
 * @param {number} data.max - The maximum NDVI value.
 * @param {number} data.min - The minimum NDVI value.
 * @param {number} data.std - The standard deviation of NDVI values.
 */

const NDVIValuesTable = ({data}) => {

 if(!data){

  return null;
 }

 return (
    
      <Table striped bordered hover className='mt-0 mb-0'>
        <tbody>
          <tr>
            <td>Avg:</td>
            <td>
              <Badge className="mt-2" bg="secondary">
                {Number(data.average).toFixed(2)}
              </Badge>
            </td>
          </tr>
          <tr>
            <td>Max:</td>
            <td>
              <Badge className="mt-2" bg="secondary">
                {Number(data.max).toFixed(2)}
              </Badge>
            </td>
          </tr>
          <tr>
            <td>Min:</td>
            <td>
              <Badge className="mt-2" bg="secondary">
                {Number(data.min).toFixed(2)}
              </Badge>
            </td>
          </tr>
          <tr>
            <td>Std:</td>
            <td>
              <Badge className="mt-2" bg="secondary">
                {Number(data.std).toFixed(2)}
              </Badge>
            </td>
          </tr>
        </tbody>
      </Table>    
  );
};

export default NDVIValuesTable;
