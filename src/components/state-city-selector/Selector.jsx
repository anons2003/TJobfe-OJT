import { Fragment, useState } from "react";
import {
  ComboboxInput,
  Transition,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  Combobox,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function Selector({ data, selected, setSelected }) {
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? data
      : data.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="tw-w-full">
      <Combobox value={selected} onChange={setSelected}>
        <div className="tw-relative tw-mt-1">
          <div className="tw-relative tw-w-full tw-cursor-default tw-overflow-hidden tw-rounded-lg tw-bg-white tw-text-left tw-shadow-md tw-focus:outline-none tw-focus-visible:tw-ring-2 tw-focus-visible:tw-ring-white tw-focus-visible:tw-ring-opacity-75 tw-focus-visible:tw-ring-offset-2 tw-focus-visible:tw-ring-offset-teal-300 sm:tw-text-sm">
            <ComboboxInput
              className="tw-w-full tw-outline-none tw-border-none tw-py-2 tw-pl-3 tw-pr-10 tw-text-sm tw-leading-5 tw-text-gray-900 tw-focus:tw-ring-0"
              displayValue={(person) => person.name}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Select an option"
              disabled={true}
            />
            <ComboboxButton className="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
              <ChevronUpDownIcon
                className="tw-h-5 tw-w-5 tw-text-gray-400 hover:tw-text-gray-500"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          <Transition
            as={Fragment}
            leave="tw-transition tw-ease-in tw-duration-100"
            leaveFrom="tw-opacity-100"
            leaveTo="tw-opacity-0"
            afterLeave={() => setQuery("")}
          >
            <ComboboxOptions className="tw-absolute tw-z-10 tw-mt-1 tw-max-h-60 tw-w-full tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1 tw-text-base tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-100 focus:tw-outline-none sm:tw-text-sm">
              {filteredPeople.length === 0 && query !== "" ? (
                <div className="tw-relative tw-cursor-default tw-select-none tw-py-2 tw-px-4 tw-text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((person) => (
                  <ComboboxOption
                    key={person.id}
                    className={({ active }) =>
                      `tw-relative tw-cursor-default tw-select-none tw-py-2 tw-pl-10 tw-pr-4 ${
                        active
                          ? "tw-bg-teal-600 tw-text-white"
                          : "tw-bg-white tw-text-gray-900"
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`tw-block tw-truncate ${
                            selected ? "tw-font-medium" : "tw-font-normal"
                          }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3 ${
                              active ? "tw-text-white" : "tw-text-teal-600"
                            }`}
                          >
                            <CheckIcon
                              className="tw-h-5 tw-w-5"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default Selector;
