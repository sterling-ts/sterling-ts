import { DatumParsed } from '@/sterling-connection';
import { useCallback, MouseEvent } from 'react';
import { activeDatumSet } from '../../../statenew/data/dataSlice';
import { useSterlingDispatch } from '../../../statenew/hooks';
import { ListViewItem } from './ListViewItem';

interface ListViewProps {
  data: DatumParsed<any>[];
  activeDatumId: string | null;
}

const ListView = (props: ListViewProps) => {
  const { data, activeDatumId } = props;
  const dispatch = useSterlingDispatch();

  const onClickRow = useCallback(
    (event: MouseEvent, datum: DatumParsed<any>) => {
      dispatch(activeDatumSet(datum.id));
    },
    []
  );

  return (
    <div className='w-full grid grid-cols-[minmax(max-content,auto)_repeat(2,min-content)]'>
      {data.map((datum) => {
        const { id } = datum;
        return (
          <ListViewItem
            key={id}
            datum={datum}
            active={activeDatumId === id}
            onClickItem={onClickRow}
          />
        );
      })}
    </div>
  );
};

export { ListView };